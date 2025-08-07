import request from 'supertest';
import app from '../app';

describe('POST /tickets', () => { // describe = global function jest provides with types on @types/jest (Uses two arguments: a string and a function)
  
  // Test case: valid payload should create a ticket
  it('should return 201 and the ticket when payload is valid', async () => {
    // Define the request body for a successful ticket creation
    const payload = { title: 'Test ticket', description: 'Details' };

    // Perform an HTTP POST to /tickets on our app,
    // send the payload as JSON and set the Accept header
    const res = await request(app)
      .post('/tickets')
      .send(payload)
      .set('Accept', 'application/json');

    // Assert that the response status code is 201 Created
    expect(res.status).toBe(201);

    // Assert that the response body matches an object with:
    // - id: a valid UUID v4 string
    // - title: same as the payload
    // - description: same as the payload
    expect(res.body).toMatchObject({
      id: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      ),
      title: 'Test ticket',
      description: 'Details'
    });
  });

  // Test case: missing title field should result in a validation error
  it('should return 400 if title is missing', async () => {
    // Define a payload missing the required "title" field
    const payload = { description: 'No title here' };

    // Perform the same POST request without title
    const res = await request(app)
      .post('/tickets')
      .send(payload)
      .set('Accept', 'application/json');

    // Assert that the response status code is 400 Bad Request
    expect(res.status).toBe(400);

    // Assert that the response body contains the expected error message
    expect(res.body).toEqual({ error: 'Field "title" is required' });
  });
});
