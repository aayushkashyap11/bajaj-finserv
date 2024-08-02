const { Handler } = require('@netlify/functions');

const handler = async (event, context) => {
  const { httpMethod, path, headers, body } = event;
  
  // Handle GET request
  if (httpMethod === 'GET' && path === '/bfhl') {
    return {
      statusCode: 200,
      body: JSON.stringify({ operation_code: 1 }),
    };
  }

  // Handle POST request
  if (httpMethod === 'POST' && path === '/bfhl') {
    try {
      const { status, userID, collegeEmail, collegeRollNumber, numbers, alphabets } = JSON.parse(body);

      if (!status || !userID || !collegeEmail || !collegeRollNumber || !Array.isArray(numbers) || !Array.isArray(alphabets)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ is_success: false, message: 'Invalid input data' }),
        };
      }

      const user_id = `${userID.toLowerCase().replace(/\s/g, '_')}_${new Date().toLocaleDateString('en-GB').split('/').reverse().join('')}`;

      return {
        statusCode: 200,
        body: JSON.stringify({
          status,
          user_id,
          collegeEmail,
          collegeRollNumber,
          numbers,
          alphabets,
          is_success: true,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ is_success: false, message: 'Server error' }),
      };
    }
  }

  // Return 404 for other paths
  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Not Found' }),
  };
};

module.exports = { handler };
