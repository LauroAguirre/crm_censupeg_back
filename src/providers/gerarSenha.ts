class Senhas {
  gerarNovaSenha (tamanho: number):string {

    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let senha = ''

      for (let i = 1; i <= tamanho; i++) {
        const random = Math.floor(Math.random() * chars.length)
        senha += chars.substring(random, random + 1)
      }

      return senha
  }

}

export default new Senhas()
