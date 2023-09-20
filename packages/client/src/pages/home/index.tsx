import React from 'react';
import { Col, Row, Button, Input } from 'antd';
import './styles.scss';

const Home = () => {
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
            <Input type="text" placeholder="input room id"/>
          </Col>
          <Col span={6}>
            <Button>Join</Button>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Input type="text" placeholder="input your name"/>
          </Col>
          <Col span={6}>
            <Button>Create</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;