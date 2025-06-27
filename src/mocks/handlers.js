import {rest} from 'msw';

const users = Array.from({length :20}, (_,i) =>({
    id: (i+1).toString(),
    firstName : `User${i+1}`,
    lastName : `Lname${i+1}`,
    email:`user${i + 1}@eg.com`,
    password: `pass${i + 1}`,
    role: i === 0 ? 'Admin' : i % 10 === 0 ? 'Manager' : 'Customer',
    status: i % 3 === 0 ? 'Active' : 'Inactive',
    contactNo: `98765432${i}`,
    address: `Street ${i + 1}`,
}));

export const handlers =[
    rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(users));
    }),

    
    rest.put('/api/users/:id', async (req, res, ctx) => {
        const {id} = req.params;
        const updatedData = await req.json();
        const index = users.findIndex(u => u.id===id);
        if(index!== -1) {
            users[index] = {...users[index],...updatedData};
        }
        return res(ctx.status(200), ctx.json(users[index]));
    }),

    rest.delete('/api/users/:id', (req, res, ctx)=> {
        const index = users.findIndex(u => u.id === req.params.id);
        if(index!== -1) users.splice(index,1);
        return res(ctx.status(200));
    })
];
