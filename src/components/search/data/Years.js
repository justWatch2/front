const Years =[
    {
        "PARTITION":"1990",
        "select": false,
        "name":"2000 이하",
    },
    {
        "PARTITION":"2000",
        "select": false,
        "name":"2000~2010"
    },{
        "PARTITION":"2010",
        "select": true,
        "name":"2010~2020"
    },{
        "PARTITION":"2020",
        "select": true,
        "name":"2020~2030"
    },{
        "PARTITION":"future",
        "select": false,
        "name":"개봉예정 2030~"
    }
]

export default Years;
