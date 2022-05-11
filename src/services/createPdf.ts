import puppeteer from 'puppeteer'
import fs from 'fs'

export const generatePdf = async (html: string, path: string, fileName: string, landscape: boolean, htmlHeader?: string, htmlFooter?: string) : Promise<Buffer> => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }

  await page.setContent(html)
  await page.emulateMediaType('screen')

  const pdfFile = await page.pdf({
    path: `${path}/${fileName}.pdf`,
    format: 'a4',
    landscape,
    displayHeaderFooter: !!htmlFooter || !!htmlHeader,
    headerTemplate: htmlHeader,
    footerTemplate: htmlFooter,
    margin: {
      top: '20px',
      right: '15px',
      left: '15px',
      bottom: '20px'
    }
  })

  console.log('PDF gerado')
  await browser.close()

  return pdfFile
}
