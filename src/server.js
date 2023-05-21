const express = require('express');
const app = express();

// app.use('/', (req, res) => {
//     return res.send('asdasssd');
// });

app.get('/api', (req, res) => {
    return res.json({
        user: 'asdasd1',
    });
});
app.listen(5000, 'localhost', () => {
    console.log('Backendapp listening on port 5000');
});
