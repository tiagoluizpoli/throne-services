import cripto from 'node:crypto'

interface GetHashParams {
  content: string | object
}

export const getHash = ({ content }: GetHashParams): string => {
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }

  return cripto.createHash('sha1').update(content).digest('hex')
}
