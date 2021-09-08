interface IUser {
  id: string;
  name: string;
  room: string;
}

let users: IUser[] = [];

export const addUser = ({ id, name, room }: IUser) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => {
    return user.room === room && user.name === name;
  });

  if (!name || !room) {
    return { error: 'Username and room are required' };
  }
  if (existingUser) {
    return { error: 'Username is taken' };
  }
  const user = { id, name, room };

  users.push(user);
  return { user };
};
