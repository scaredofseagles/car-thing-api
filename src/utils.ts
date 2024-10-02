export const generateString = (length: number) => {
    let finalString = "";
  
    const finalCharSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  
    for (let i = 0; i < length; i++) {
      const randomInt = Math.floor(Math.random() * finalCharSet.length);
      finalString += finalCharSet[randomInt];
    }
  
    return finalString;
  };

  export const getUrlHost = (req: any) => {
    const url = new URL(req.url);
    const protocol = url.protocol.slice(0, -1);

    return `${protocol}://${req.header('host')}`;
  }