import { beforeEach, describe, expect, test } from '@jest/globals'
import bcrypt from 'bcrypt'
import { User } from '../models/users.js'
import {
  logOutUser,
  refreshUserSession,
  userLogin,
  userRegister,
} from '../services/users.js'

beforeEach(async () => {
  process.env.ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET || 'test-access-secret'
  process.env.REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || 'test-refresh-secret'
  await User.deleteMany({})
})

describe('user services', () => {
  test('registers a new user with hashed password', async () => {
    const payload = {
      username: 'blogger',
      email: 'blogger@test.com',
      password: 'test1234',
    }

    const user = await userRegister(payload)

    expect(user._id).toBeDefined()
    expect(user.email).toBe(payload.email)
    expect(user.password).not.toBe(payload.password)
    expect(await bcrypt.compare(payload.password, user.password)).toBe(true)
  })

  test('logs in and stores refresh token hash', async () => {
    const registered = await userRegister({
      username: 'blogger',
      email: 'blogger@test.com',
      password: 'test1234',
    })

    const session = await userLogin({
      email: 'blogger@test.com',
      password: 'test1234',
    })

    expect(session.accessToken).toBeDefined()
    expect(session.refreshToken).toBeDefined()
    expect(session.user.email).toBe('blogger@test.com')

    const persisted = await User.findById(registered._id)
    expect(persisted.refreshTokenHash).toBeDefined()
    expect(persisted.refreshTokenHash).not.toBe(session.refreshToken)
  })

  test('refresh rotates refresh token and invalidates the old token', async () => {
    await userRegister({
      username: 'blogger',
      email: 'blogger@test.com',
      password: 'test1234',
    })
    const firstSession = await userLogin({
      email: 'blogger@test.com',
      password: 'test1234',
    })

    const rotated = await refreshUserSession(firstSession.refreshToken)
    expect(rotated.accessToken).toBeDefined()
    expect(rotated.refreshToken).toBeDefined()
    expect(rotated.refreshToken).not.toBe(firstSession.refreshToken)

    await expect(
      refreshUserSession(firstSession.refreshToken),
    ).rejects.toMatchObject({
      status: 403,
    })
  })

  test('logout clears persisted refresh session', async () => {
    const user = await userRegister({
      username: 'blogger',
      email: 'blogger@test.com',
      password: 'test1234',
    })
    const session = await userLogin({
      email: 'blogger@test.com',
      password: 'test1234',
    })

    await logOutUser(session.refreshToken)
    const persisted = await User.findById(user._id)

    expect(persisted.refreshTokenHash).toBeNull()
    expect(persisted.refreshTokenExpiresAt).toBeNull()
  })
})
