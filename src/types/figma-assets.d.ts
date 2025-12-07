// Type declarations for figma:asset imports
declare module 'figma:asset/*' {
  const content: string;
  export default content;
}

// Type declarations for regular image imports
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
