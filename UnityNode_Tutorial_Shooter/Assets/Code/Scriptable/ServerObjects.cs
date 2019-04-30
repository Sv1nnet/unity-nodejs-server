using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace Project.Scriptable
{
    [CreateAssetMenu(fileName = "Server_Objects", menuName = "Scriptable Objects/Server Objects", order = 3)]
    public class ServerObjects : ScriptableObject
    {
        public List<ServerObjectsData> objects;

        public ServerObjectsData GetObjectByName(string name)
        {
            return objects.SingleOrDefault(x => x.Name == name);
        }
    }

    [Serializable]
    public class ServerObjectsData
    {
        public string Name = "New Object";
        public GameObject Prefab;
    }
}

