using Project.Networking;
using Project.Utility;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Project.Player
{
    public class PlayerManager : MonoBehaviour
    {
        const float BARREL_PIVOT_OFFSET = 90.0F;

        [Header("Data")]
        [SerializeField]
        private float speed = 2;
        [SerializeField]
        private float rotation = 60;

        [Header("Object References")]
        [SerializeField]
        private Transform barrelPivote;
        [SerializeField]
        private Transform bulletSpawnPoint;

        [Header("Class References")]
        [SerializeField]
        private NetworkIdentity networkIdentity;

        private float lastRotation;

        // Shooting
        private BulletData bulletData;
        private Cooldown shootingCooldown;

        private void Start()
        {
            shootingCooldown = new Cooldown(1);
            bulletData = new BulletData();
        }

        // Update is called once per frame
        void Update()
        {
            if (networkIdentity.IsControlling())
            {
                CheckMovement();
                CheckAiming();
                CheckShooting();
            }
        }

        public float GetLastRotation()
        {
            return lastRotation;
        }

        public void SetRotation(float value)
        {
            barrelPivote.rotation = Quaternion.Euler(0, 0, value + BARREL_PIVOT_OFFSET);
        }

        private void CheckMovement()
        {
            float horizontal = Input.GetAxis("Horizontal");
            float vertical = Input.GetAxis("Vertical");

            transform.position += -transform.up * vertical * speed * Time.deltaTime;
            transform.Rotate(new Vector3(0, 0, -horizontal * rotation * Time.deltaTime));
        }

        private void CheckAiming()
        {
            Vector3 mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            Vector3 dif = mousePosition - transform.position;
            dif.Normalize();
            float rot = Mathf.Atan2(dif.y, dif.x) * Mathf.Rad2Deg;

            lastRotation = rot;

            barrelPivote.rotation = Quaternion.Euler(0, 0, rot + BARREL_PIVOT_OFFSET);
        }

        private void CheckShooting()
        {
            shootingCooldown.CooldownUpdate();

            if(Input.GetMouseButton(0) && !shootingCooldown.IsOnCooldown())
            {
                shootingCooldown.StartCoolDown();

                // Define Bullet
                bulletData.position.x = bulletSpawnPoint.position.x.TwoDecimals().ToString();
                bulletData.position.y = bulletSpawnPoint.position.y.TwoDecimals().ToString();
                bulletData.direction.x = bulletSpawnPoint.up.x.ToString();
                bulletData.direction.y = bulletSpawnPoint.up.y.ToString();

                string json = JsonUtility.ToJson(bulletData);
                JSONObject jsonObj = new JSONObject(json);

                // Send Bullet
                print(jsonObj);
                networkIdentity.GetSocket().Emit("fireBullet", jsonObj);
            }
        }
    }
}
