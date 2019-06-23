using Project.Networking;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Project.Gameplay
{
    public class Projectile : MonoBehaviour
    {
        private Vector2 direction;
        private float speed;

        public float Speed { get => speed; set => speed = value; }
        public Vector2 Direction { get => direction; set => direction = value; }

        // Update is called once per frame
        void Update()
        {
            Vector2 pos = direction * speed * NetworkClient.SERVER_UPDATE_TIME * Time.deltaTime;
            transform.position += new Vector3(pos.x, pos.y, 0);
        }
    }
}
