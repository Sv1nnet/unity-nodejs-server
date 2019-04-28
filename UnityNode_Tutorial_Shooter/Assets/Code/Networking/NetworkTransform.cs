using Project.Utility.Attributes;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Project.Networking
{
    [RequireComponent(typeof(NetworkIdentity))]
    public class NetworkTransform : MonoBehaviour
    {
        [SerializeField]
        [GreyOut]
        private Vector3 oldPosition;

        private NetworkIdentity networkIdentity;
        private Player player;

        private float stillCounter = 0;
        // Start is called before the first frame update
        void Start()
        {
            networkIdentity = GetComponent<NetworkIdentity>();
            oldPosition = transform.position;
            player = new Player();
            player.position = new Position();
            player.position.x = "0";
            player.position.y = "0";

            //player.x = 0;
            //player.y = 0;


            if (!networkIdentity.IsControlling())
            {
                enabled = false;
            }
        }

        // Update is called once per frame
        void Update()
        {
            if (networkIdentity.IsControlling())
            {
                if(oldPosition != transform.position)
                {
                    oldPosition = transform.position;
                    stillCounter = 0;
                    SendData();
                }
                else
                {
                    stillCounter += Time.deltaTime;

                    if (stillCounter >= 1)
                    {
                        stillCounter = 0;
                        SendData();
                    }
                }
            }
        }

        private void SendData()
        {
            // Update player information
            player.position.x = (Mathf.Round(transform.position.x * 1000.0f) / 1000.0f).ToString();
            player.position.y = (Mathf.Round(transform.position.y * 1000.0f) / 1000.0f).ToString();

            string json = JsonUtility.ToJson(player);
            JSONObject jsonObj = new JSONObject(json);
            print("Position field: " + jsonObj["position"]);


            networkIdentity.GetSocket().Emit("updatePosition", jsonObj);
        }
    }
}

