const warehouseJSON = [
    {
        history: [
            [1, "Corn", "San Francisco", "Las Vegas"],
            [2, "Fruit", "San Francisco", "New York"], 
            [3, "Fruit", "San Francisco", "Seattle"],
            [4, "Food", "San Francisco", "Miami"],
            [5, "Milk", "Kansas", "San Francisco"],
            [6, "Avacado", "Los Angeles", "Boston"],
            [7, "Melon", "Los Angeles", "Boston"],
            [8, "Cherries", "Sacramento", "Florida"],
            [9, "Oranges", "Oakland", "Michigan"],
            [10, "Beef", "Wisconsin", "San Francsico"]
        ]
    },
    {
        sensorId: 1,
        type: "temperature",
        status: "operational",
        history: [
            ["11/12/2020-16:15", "71"],
            ["11/12/2020-16:10", "71"],
            ["11/12/2020-16:05", "71"],
            ["11/12/2020-16:00", "69"],
            ["11/12/2020-15:55", "69"],
            ["11/12/2020-15:50", "69"],
            ["11/12/2020-15:45", "69"],
            ["11/12/2020-15:40", "67"],
            ["11/12/2020-15:35", "67"],
            ["11/12/2020-15:30", "67"]
        ]
    }
]

export default warehouseJSON;