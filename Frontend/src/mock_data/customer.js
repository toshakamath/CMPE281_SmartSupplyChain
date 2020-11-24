const customerJson = [
    {
        "name": "Eric Food Supplier",
        "warehouses": [
            {
                "id" : 1,
                "name": "Alpha",
                "state": "Illinois",
                "location": {
                    "lat": 40.854885,
                    "lng": -88.081807},
                "status" : "operational",
                "orders": 20,
                "sensor": [
                        {
                            "sensorid": 1,
                            "name": "Temperature Sensor",
                            "type": "temperature",
                            "status": "operational",
                            "history": [["11/12/2020-16:15", "71"],
                            ["11/12/2020-16:10", "71"],
                            ["11/12/2020-16:05", "71"],
                            ["11/12/2020-16:00", "69"],
                            ["11/12/2020-15:55", "69"],
                            ["11/12/2020-15:50", "69"],
                            ["11/12/2020-15:45", "69"],
                            ["11/12/2020-15:40", "67"],
                            ["11/12/2020-15:35", "67"],
                            ["11/12/2020-15:30", "67"]]
                        },
                        {
                            "sensorid": 1,
                            "name": "UV Sensor",
                            "type": "uv",
                            "status": "operational",
                            "history": [["11/12/2020-16:15", "2"],
                            ["11/12/2020-16:10", "2"],
                            ["11/12/2020-16:05", "2"],
                            ["11/12/2020-16:00", "2"],
                            ["11/12/2020-15:55", "4"],
                            ["11/12/2020-15:50", "1"],
                            ["11/12/2020-15:45", "1"],
                            ["11/12/2020-15:40", "2"],
                            ["11/12/2020-15:35", "2"],
                            ["11/12/2020-15:30", "2"]]
                        },
                        {
                            "sensorid": 1,
                            "name": "Humidity Sensor",
                            "type": "humidity",
                            "status": "operational",
                            "history": [["11/12/2020-16:15", "71"],
                            ["11/12/2020-16:10", "40"],
                            ["11/12/2020-16:05", "40"],
                            ["11/12/2020-16:00", "50"],
                            ["11/12/2020-15:55", "50"],
                            ["11/12/2020-15:50", "60"],
                            ["11/12/2020-15:45", "50"],
                            ["11/12/2020-15:40", "40"],
                            ["11/12/2020-15:35", "30"],
                            ["11/12/2020-15:30", "30"]]
                        },
                ]
            },
            {
                "id" : 2,
                "name": "Bravo",
                "state": "Texas",
                "location": {
                    "lat": 30.266666,
                    "lng": -97.733330},
                "status" : "operational",
                "orders": 5
            },
            {
                "id" : 3,
                "name": "Charlie",
                "state": "Illinois",
                "location": {
                    "lat": 38.854885,
                    "lng": -88.081807},
                "status" : "operational",
                "orders": 100
            },
            {
                "id" : 4,
                "name": "Delta",
                "state": "San Francisco",
                "location": {
                    "lat": 37.773972,
                    "lng": -122.431297},
                "status" : "Sensor Issue",
                "orders": 0
            },
            {
                "id" : 5,
                "name": "Epsilon",
                "state": "Florida",
                "location": {
                    "lat": 25.761681 ,
                    "lng": -80.191788},
                "status" : "operational",
                "orders": 19
            },
            {
                "id" : 5,
                "name": "Foxtrot",
                "state": "New York",
                "location": {
                    "lat": 40.730610 ,
                    "lng": -73.935242},
                "status" : "No Sensors Detected",
                "orders": 4
            }
        ]
    },
    {
        "name": "Bob the Farmer",
        "warehouses": [
            {
                "id" : 1,
                "name": "Fruit",
                "state": "Michigan",
                "location": {
                    "lat": 42.279594,
                    "lng": -83.732124
                },
                "status" : "operational",
                "orders": 20
            },
            {
                "id" : 2,
                "name": "Dairy",
                "state": "Ohio",
                "location": {
                    "lat": 30.266666,
                    "lng": -97.733330},
                "status" : "operational",
                "orders": 5
            },
            {
                "id" : 3,
                "name": "Vegtables",
                "state": "Ohio",
                "location": {
                    "lat": 39.983334,
                    "lng": -82.983330
                },
                "status" : "operational",
                "orders": 100
            },
            {
                "id" : 4,
                "name": "Other",
                "state": "Illinois",
                "location": {
                    "lat": 41.881832,
                    "lng": -87.623177},
                "status" : "error",
                "orders": 0
            }
        ]
    },
    {
        "name": "Mcdonald Food Supplier",
        "warehouses": [
            {
                "id" : 1,
                "name": "Cows",
                "state": "California",
                "location": {
                    "lat": 38.575764,
                    "lng": -121.478851},
                "status" : "operational",
                "orders": 20
            },
            {
                "id" : 2,
                "name": "Oranges",
                "state": "California",
                "location": {
                    "lat": 37.804363,
                    "lng": -122.271111},
                "status" : "operational",
                "orders": 5
            },
            {
                "id" : 3,
                "name": "Lettice",
                "state": "Oklahoma",
                "location": {
                    "lat": 35.481918,
                    "lng": -97.508469},
                "status" : "operational",
                "orders": 100
            },
            {
                "id" : 4,
                "name": "Fish",
                "state": "Oregon",
                "location": {
                    "lat": 45.523064,
                    "lng": -122.676483},
                "status" : "error",
                "orders": 0
            },
            {
                "id" : 5,
                "name": "Bread",
                "state": "Georgia",
                "location": {
                    "lat": 33.753746 ,
                    "lng": -84.386330},
                "status" : "operational",
                "orders": 19
            }
        ]
    }
]

export default customerJson;