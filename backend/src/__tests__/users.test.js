import mongoose from 'mongoose'
import { beforeEach, describe, expect, test } from '@jest/globals'
import { loginUser, userRegister } from '../services/users.js'
import { User } from '../models/users.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()
describe('User register', () => {
  test('with all parameters must succeed', async () => {
    const user = {
      username: 'blog1',
      email: 'blog1@test.com',
      password: 'test12',
    }

    const newUser = await userRegister(user)
    expect(newUser._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const findUser = await User.findById(newUser._id)
    expect(findUser.username).toBe(user.username)
    expect(findUser.email).toBe(user.email)
    expect(findUser.role).toBe('user')
  })
  test('without username must fail', async () => {
    const user = {
      email: 'blog1@test.com',
      password: 'test12',
    }
    try {
      await userRegister(user)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`username` is required')
    }
  })
  test('without email must fail', async () => {
    const user = {
      username: 'blog1',
      password: 'test12',
    }
    try {
      await userRegister(user)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`email` is required')
    }
  })
  test('without password must fail', async () => {
    const user = {
      username: 'blog1',
      email: 'blog1@test.com',
    }
    try {
      await userRegister(user)
    } catch (err) {
      expect(err.name).toBe('Error')
      expect(err.message).toContain('data and salt arguments required')
    }
  })
})
let user = []
const hashedPassword = await bcrypt.hash('test12', 10)
beforeEach(async () => {
  await User.deleteMany({})
  user = []
  const newUser = await User.create({
    username: 'blog2',
    email: 'blog2@test.com',
    password: hashedPassword,
  })
  user.push(await newUser.save())
})
describe('login', () => {
  test('with all parameter must be succed', async () => {
    const user = {
      email: 'blog2@test.com',
      password: 'test12',
    }
    const logedin = await loginUser(user)
    expect(logedin.token).toBeDefined()
    expect(logedin.email).toBe(user.email)
  })
  test('with incorrect email  must fail', async () => {
    const user = {
      email: 'blog@test.com',
      password: 'test12',
    }
    try {
      await loginUser(user)
    } catch (error) {
      expect(error.name).toBe('Error')
      expect(error.message).toBe('Incorrect Email or Password!')
    }
  })
  test('with incorrect password  must fail', async () => {
    const user = {
      email: 'blog@test.com',
      password: '1234',
    }
    try {
      await loginUser(user)
    } catch (error) {
      expect(error.name).toBe('Error')
      expect(error.message).toBe('Incorrect Email or Password!')
    }
  })
})
