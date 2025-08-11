import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Hotel Management System</h1>
      <p className="lead">Welcome to the DotNet Core REST API & GraphQL Starter Sample</p>
      
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>REST API Endpoints</h5>
            </Card.Header>
            <Card.Body>
              <p>The application provides RESTful APIs for:</p>
              <ul>
                <li><strong>Guests:</strong> <code>/api/guests</code></li>
                <li><strong>Rooms:</strong> <code>/api/rooms</code></li>
                <li><strong>Reservations:</strong> <code>/api/reservations</code></li>
              </ul>
              <p>Each endpoint supports full CRUD operations (GET, POST, PUT, DELETE).</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>GraphQL Endpoint</h5>
            </Card.Header>
            <Card.Body>
              <p>GraphQL endpoint is available at:</p>
              <ul>
                <li><strong>Endpoint:</strong> <code>/graphql</code></li>
                <li><strong>Playground:</strong> <a href="/graphql" target="_blank" rel="noopener noreferrer">/graphql</a></li>
              </ul>
              <p>Supports queries and mutations for all entities with the same CRUD capabilities.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>Features Demonstrated</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Backend Technologies:</h6>
                  <ul>
                    <li>.NET Core 3.1 Web API</li>
                    <li>Entity Framework Core</li>
                    <li>HotChocolate GraphQL</li>
                    <li>AutoMapper</li>
                    <li>Repository Pattern</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>Frontend Technologies:</h6>
                  <ul>
                    <li>React with TypeScript</li>
                    <li>Apollo Client for GraphQL</li>
                    <li>Axios for REST API calls</li>
                    <li>React Bootstrap for UI</li>
                    <li>React Router for navigation</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;