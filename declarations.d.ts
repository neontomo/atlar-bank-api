// XML file type declaration, it needs to be a string type
declare module '*.xml' {
  const content: string
  export default content
}
