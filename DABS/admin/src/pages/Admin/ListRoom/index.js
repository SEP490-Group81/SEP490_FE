import { useEffect, useState } from "react";
import { getRoomList } from "../../services/roomService";
import { Badge, Button, Card, Col, Collapse, Image, Row } from "antd";
import { Color } from "antd/es/color-picker";
import { UnorderedListOutlined,AppstoreOutlined } from '@ant-design/icons';
import RoomGrid from "./roomGrid";

import RoomTable from "./roomTable";
function ListRoom() {
    const [rooms, setRooms] = useState([]);
    const [isGrid, setIsGrid] = useState(true);
    const fetchApi = async () => {
        const result = await getRoomList();
        setRooms(result);
        //   console.log(topics);
    }
    useEffect(() => {
     
        fetchApi();
    }, []);

    const handleReload = () => {
        fetchApi();
    }
    console.log(rooms);
    return (
        <>
            <Button onClick={() => setIsGrid(!isGrid)}>
             {isGrid? (<AppstoreOutlined />) : (<UnorderedListOutlined />) }
            </Button>
           {isGrid ? 
        (   <>
        <RoomGrid rooms = {rooms}/>
        </>) 
        :
        (<>
        <RoomTable rooms = {rooms} onReload={handleReload}/>
        </>)   
        }
        </>

    )
}

export default ListRoom;