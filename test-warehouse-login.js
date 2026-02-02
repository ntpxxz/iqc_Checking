async function testLogin(email, password) {
    console.log(`Testing login for ${email} on http://localhost:3065...`);
    try {
        const response = await fetch('http://localhost:3065/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: email,
                password: password
            })
        });

        const rawText = await response.text();
        console.log(`Status: ${response.status}`);

        try {
            const responseJson = JSON.parse(rawText);
            if (response.ok) {
                console.log('Login Successful! ✅');
                const data = responseJson.data || responseJson; // Handle wrapped or unwrapped
                console.log('Token received:', data.token ? 'YES' : 'NO');
                console.log('User:', data.user);
            } else {
                console.log('Login Failed ❌');
                console.error('Error JSON:', responseJson);
            }
        } catch (e) {
            console.error('Response was not JSON. Raw body:');
            console.log(rawText.substring(0, 500)); // Print first 500 chars to see error
        }
    } catch (error) {
        console.error('Connection Error:', error.message);
        console.log('Is the warehouse-mobile server running on port 3065?');
    }
}

testLogin('admin@example.com', 'password123');
