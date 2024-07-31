import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

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
  app.get( "/filteredimage", async (req, res) => {
    const image_url = req.query.image_url;
    if (!image_url) {
      return res.status(400).send(`Images url is mandatory`);
    }

    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
    if(!validExtensions.some(extension => image_url.toLowerCase().endsWith(extension))) {
      return res.status(400).send(`Images url is not correct`);
    };
    let outpath;
    await filterImageFromURL(image_url).then(outpath => {
      console.log("Retrive file succesfully")
      return res.status(200).sendFile(outpath, async err => {
        console.log("Delete any files")
        await deleteLocalFiles([outpath])
      })
    }).catch(e => {
      return res.status(500).send(`Failed to retrive images` + e);
    })
  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
