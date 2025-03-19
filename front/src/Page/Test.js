import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { createNewTest } from '../Redux/Slice/test.slice';

function Test() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createNewTest({ email, password }));
  }



  return (




    <div className='bg-dark text-white ' style={{ height: '100vh' }}>

      <Form onSubmit={handleSubmit} >

        <Form.Group className="mb-3" controlId="formBasicEmail">

          <Form.Label>Email address</Form.Label>
          <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" />

        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        </Form.Group>


        <Button variant="primary" type="submit">
          Submit
        </Button>

      </Form>

    </div>
  )
}

export default Test;
