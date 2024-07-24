import User from "../models/userModel";
import { Request, Response } from "express";

const get = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id ? parseInt(req.params.id.replace(/\D/g, ''), 10) : null;

    if(!id) {
      const response = await User.findAll({
        attributes: ['id', 'nome', 'email'],
        order: [['id', 'ASC']],
      });

      return res.status(200).send({
        message: 'All users found',
        data: response,
      });
    }

    const response = await User.findOne({
      where: { id },
      attributes: ['id', 'nome', 'email'],
    });

    if(!response){
      return res.status(404).send({
        message: `UserId: ${id} not found`,
        data: [],
      });
    }

    return res.status(200).send({
      message: `UserId: ${id} found`,
      data: response,
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    const errorMessage = (error as Error).message;

    return res.status(500).send({
      message: 'Oops! An error occurred.',
      error: errorMessage,
    });
  }
}

const post = async (req: Request, res: Response): Promise<Response> => {
  try {

    const {
      nome,
      email,
      senha
    } = req.body;

    const verifyEmail = await User.findOne({
      where: { email },
    });
    if(verifyEmail){
      return res.status(400).send({
        message: 'Email already registered',
        data: [],
      });
    }

    await User.create({
      nome,
      email,
      senha,
    });

    return res.status(201).send({
      message: 'User created',
      data: {
        nome,
        email,
      },
    });

  } catch (error) {
    console.error('Error creating user:', error);
    const errorMessage = (error as Error).message;

    return res.status(500).send({
      message: 'Oops! An error occurred.',
      error: errorMessage,
    });
  }
}

const update = async (req: Request, res: Response): Promise<Response> => {

  const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

  if (!id) {
    return res.status(400).send({
      message: 'No id provided',
      data: [],
    });
  }

  const response = await User.findOne({ where: { id } });

  if (!response) {
    return res.status(400).send({
      message: `UserId: ${id} not found`,
      data: [],
    });
  }

  if (req.body.senha) {
    req.body.senha = null;
  }

  (Object.keys(req.body) as string[]).forEach((field) => {
    (response as any)[field] = req.body[field];
  });

  await response.save();
  return res.status(200).send({
    message: `UserId: ${id} updated`,
    data: response,
  });
};

const destroy = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    if (!id) {
      return res.status(400).send({
        message: 'No id provided',
        data: [],
      });
    }

    const response = await User.findOne({ where: { id } });

    if (!response) {
      return res.status(400).send({
        message: `UserId: ${id} not found to delete`,
        data: [],
      });
    }

    await response.destroy();
    return res.status(200).send({
      message: `UserId: ${id} deleted`,
      data: [],
    });
  } catch (error) {
    const errorMessage = (error as Error).message;

    return res.status(500).send({
      message: 'Oops! An error occurred.',
      error: errorMessage,
    });
  }
};

export default {
  get,
  post,
  update,
  destroy,
}