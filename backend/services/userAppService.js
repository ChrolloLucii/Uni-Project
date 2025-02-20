import UserService from '../domain/services/userService.js';
import FakeUserRepository from '../domain/fakeRepositories/fakeUserRepository.js';

const repository = new FakeUserRepository();
const userService = new UserService(repository);

export default {
    async registration(req, res) {
        try {
            const { id, nickname, role } = req.body;
            const user = await userService.registerUser({ id, nickname, role });
            return res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(Number(id));
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateUser(req, res) {
        try {
            const userData = req.body;
            const updatedUser = await userService.updateUser(userData);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await userService.deleteUser(Number(id));
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};
