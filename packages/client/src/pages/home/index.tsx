import React, { useState } from 'react';
import { Col, Row, Button, Input, message } from 'antd';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import AvatarSelector from '../../components/AvatarSelector';

const Home = () => {

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<null | string>(null);
  const navigate = useNavigate();

  const join = () => {
    if (!setRoomId) {
      message.error('Please input the room id');
      return;
    }
    if (!username) {
      message.error('Please input your username');
      return;
    }
    if (!avatar) {
      message.error('Please select an avatar');
      return;
    }
    navigate('/game', {
      state: {
        avatar,
        roomId,
        avatar
      }
    });
  }

  return (
    <div className="mi-home-page">
      <div className="home-content">
        <h1>MSSP</h1>
        <Row>
          <Col span={18}>
            Season time: xxxx Min
          </Col>
          <Col span={6}>
            <Button>Create</Button>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Input placeholder="input room id" value={roomId} onChange={(e) => setRoomId(e.target.value)}/>
          </Col>
          <Col span={6}>
            <Button onClick={join}>Join</Button>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Input placeholder="input your name" value={username} onChange={(e) => setUsername(e.target.value)}/>
          </Col>
          <Col span={6}>
            <AvatarSelector onChange={(value) => setAvatar(value)}/>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;