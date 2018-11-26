<?php



$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

if ($contentType === "application/json") {
  //Receive the RAW post data.
  $content = trim(file_get_contents("php://input"));

  $decoded = json_decode($content, true);


  file_put_contents('data.txt',$content);


  $image = $decoded->upload;
  $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
  file_put_contents('upload.png', $data);
  
  $image = $decoded->original;
  $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
  file_put_contents('original.png', $data);

  echo "Exported";

  //If json_decode failed, the JSON is invalid.
  if(! is_array($decoded)) {

  } else {
    // Send error back to user.
  }
}



