using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Project.MovementInterpolation
{
    public class MoveBulletInterpolation : MonoBehaviour
    {
        [SerializeField] float speed = 0;
        [SerializeField] float tpDistance = 0;
        [SerializeField] Vector3 target;

        public Vector3 Target { get => target; set => target = value; }

        // Start is called before the first frame update
        void Start()
        {
            target = transform.position;
        }

        // Update is called once per frame
        void Update()
        {
            if (Mathf.Abs(target.x) - Mathf.Abs(transform.position.x) > tpDistance || Mathf.Abs(target.y) - Mathf.Abs(transform.position.y) > tpDistance)
            {
                print("Teleported to " + target);
                transform.position = target;
            }
            if (target != transform.position)
            {
                transform.position = Vector3.MoveTowards(transform.position, target, speed * Time.deltaTime);
            }
            else
            {
                print("Bullet transform == target " + transform.position);
            }
            if (Time.deltaTime > 0.017f)
            {
                print(Time.deltaTime);
            }
        }
    }
}
