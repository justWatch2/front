const Years =[
    {
        "PARTITION":"p1990s",
        "select": false,
        "name":"2000 이하"
    },
    {
        "PARTITION":"p2000s",
        "select": false,
        "name":"2000~2010"
    },{
        "PARTITION":"p2010s",
        "select": true,
        "name":"2010~2020"
    },{
        "PARTITION":"p2020s",
        "select": true,
        "name":"2020~2030"
    },{
        "PARTITION":"p_future",
        "select": false,
        "name":"개봉예정 2030~"
    }
]

export default Years;
