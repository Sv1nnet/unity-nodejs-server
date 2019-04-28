using Project.Networking;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Project.Player
{
    public class PlayerManager : MonoBehaviour
    {
        [Header("Data")]
        [SerializeField]
        private float speed;

        [Header("Class References")]
        [SerializeField]
        private NetworkIdentity networkIdentity;

        // Update is called once per frame
        void Update()
        {
            if (networkIdentity.IsControlling())
            {
                CheckMovement();
            }
        }

        private void CheckMovement()
        {
            float horizontal = Input.GetAxis("Horizontal");
            float vertical = Input.GetAxis("Vertical");

            transform.position += new Vector3(horizontal, vertical, 0) * speed * Time.deltaTime;
        }
    }
}
