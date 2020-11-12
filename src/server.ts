import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { fromNode } from 'bluebird';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  
  
  
  app.get( "/filteredimage/", 
    async function (req: Request, res: Response) {

      let { imageURL } = req.query;

      //check if any text is supplied for image URL
      if (!imageURL) {
        return res.status(400)
          .send(`Image URL is required: try GET /filteredimage?image_url={{}}`);
      }

      //check if  the provided text is valid for a URL
      if( !validURL(imageURL)) {
        return res.status(400)
                    .send(`URL is not a valid format for a URL`);
      }

      let filteredImagePath:string =  await filterImageFromURL(imageURL);

      //Call code to filter the image
      //res.status(200).sendFile(await filterImageFromURL(imageURL));
      res.status(200).sendFile(filteredImagePath, 
        //delete the image in the return function
        function(err){
          if(err) {
            console.log( `Image attempted to but Failed to SEND` );
          }
          else {
            deleteLocalFiles([].concat( filteredImagePath));
          }
        });
    } );

//function from https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url/49849482 to check for valid URL format
function validURL(str: string) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();