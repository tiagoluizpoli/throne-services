import { faker } from '@faker-js/faker'
import { getHash } from '@solutions/core/domain'

type Tokens = {
  token: string
  hashedToken: string
}

export const mockToken = (tokenPassed?: string): Tokens => {
  const token = tokenPassed ?? faker.string.uuid()
  const hashedToken = getHash({ content: token })
  return {
    token,
    hashedToken,
  }
}

export const createTokens = (): Record<string, Tokens> => {
  const correctToken = mockToken()
  const secondaryCorrectToken = mockToken()

  return {
    correctToken,
    secondaryCorrectToken,
  }
}

interface CreateTokensParams {
  customTokens?: { name: string; value: string }[]
}
