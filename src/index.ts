import express, { Request, Response } from "express"
const app = express()

//middleware
app.use(express.json())
app.use('/',  express.static('public'));

type User =
{
    id:number,
    username:string,
    fullname:string
}

const users:User[] = 
[
    {id: 1, username: "icecreampandarockdog", fullname: "Mateo Matias"},
    {id: 2, username: "normanbatesbeautiful", fullname: "Norman Peralta"},
    {id: 3, username: "aceventurabridgebird", fullname: "Luisa Vent"},
]
let climbingID = users.length;

//endpoint
app.get('/users', function (req: Request, res: Response)
{
    res.json(users);
})

app.get('/users/:id', (req: Request, res: Response) =>
{
    const requestedID = parseInt(req.params.id)
    if (isNaN(requestedID) || requestedID <= 0) 
    {
        return res.status(400).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                message: 'The requested ID is not a number'
            }
        )
    }
    const user = users.find((u:User) => u.id === requestedID)
    if (!user) {
        return res.status(404).json(
            {
                statusCode: 404,
                statusValue: 'Not found',
                Message: `The user with the ID ${requestedID} has not been found`
            }
        )
    }
    return res.json(
        {
            statusCode: 200,
            statusValue: 'OK',
            data: user
        }
    )
})

app.post('/users', (request: Request, response: Response) =>
{
    const {username, fullname} = request.body;
    if (username.trim().length === 0) 
    {
        return response.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `username is required`
        })
    }
    const existingUser = users.find((u:User) => u.username === username)
    if (existingUser) {
        return response.status(400).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                Message: `The user ${username} already exist`
            }
        )
    }

    climbingID += 1;
    const newUser =
    {
        id: climbingID,
        username,
        fullname
    }
    users.push(newUser);
    response.json(newUser);
})

//PUT: El cual actualiza el fullname de un usuario, si el id del cliente no exite debe devolver not found.
app.put('/users/:id', (request:Request, response:Response) =>
{
    const { fullName, username } = request.body;
    let requestID = parseInt(request.params.id)
    if (isNaN(requestID)) 
    {
        return response.status(400).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                message: 'Requested ID is not a number'
            }
        )
    }
    const existingUser = users.find((u:User) => u.id === requestID)
    if (!existingUser) {
        return response.status(404).json(
            {
                statusCode: 404,
                statusValue: 'Not found',
                message: `There's no user with the id ${requestID}`
            }
        )
    }
    if (fullName.trim().length === 0 || username.trim().length === 0) 
    {
        return response.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `username is required`
        })
    }
    const checkUsername = users.find((u:User) => u.username === username)
    if (checkUsername) {
        return response.status(404).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                message: `There's already an user with that name`
            }
        )
    }

    existingUser.fullname = fullName;
    existingUser.username = username;
    users[existingUser.id-1] = existingUser;

    return response.status(200).json(
        {
            statusCode: 200,
            statusValue: 'OK',
            data: existingUser
        })
})

//DELETE: El cual borra un usuario existente, sino existe debe devolver not found
app.delete('/users/:id', (request:Request, response:Response) =>
{
    let requestID = parseInt(request.params.id)
    if (isNaN(requestID)) 
    {
        return response.status(400).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                message: 'Requested ID is not a number'
            }
        )
    }
    const existingUser = users.find((u:User) => u.id === requestID)
    if (!existingUser) {
        return response.status(404).json(
            {
                statusCode: 404,
                statusValue: 'Not found',
                message: `There's no user with the id ${requestID}`
            }
        )
    }
    users.splice(existingUser.id-1, 1);
    return response.status(200).json(
        {
            statusCode: 200,
            statusValue: 'OK',
            message: `User ${existingUser.fullname} successfully deleted`
        }
    )
})

app.listen(3000, () => console.log('Server running at port 3000'))