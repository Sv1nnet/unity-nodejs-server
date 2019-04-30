using Project.Player;
using Project.Utility;
using Project.Utility.Attributes;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Project.Networking
{
    [RequireComponent(typeof(NetworkIdentity))]
    public class NetworkRotation : MonoBehaviour
    {
        [Header("Referenced Values")]
        [SerializeField]
        [GreyOut]
        private float oldTankRotation;
        [SerializeField]
        [GreyOut]
        private float oldBarrelRotation;

        [Header("Class Refeneces")]
        [SerializeField]
        private PlayerManager playerManager;

        private NetworkIdentity networkIdentity;
        private PlayerRotation player;

        private float stillCounter;

        // Start is called before the first frame update
        void Start()
        {
            networkIdentity = GetComponent<NetworkIdentity>();

            player = new PlayerRotation();

            if (!networkIdentity.IsControlling())
            {
                enabled = false;
            }
        }

        // Update is called once per frame
        void Update()
        {
            if(networkIdentity.IsControlling())
            {
                if(oldTankRotation != transform.localEulerAngles.z || oldBarrelRotation != playerManager.GetLastRotation())
                {
                    oldTankRotation = transform.localEulerAngles.z;
                    oldBarrelRotation = playerManager.GetLastRotation();
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
            player.tankRotation = transform.localEulerAngles.z.TwoDecimals().ToString();
            player.barrelRotation = playerManager.GetLastRotation().TwoDecimals().ToString();

            string json = JsonUtility.ToJson(player);
            JSONObject jsonObj = new JSONObject(json);

            networkIdentity.GetSocket().Emit("updateRotation", jsonObj);
        }
    }
}

