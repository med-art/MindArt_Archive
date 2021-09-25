function eraseDrawing() {


  if (eraserVersion) {

    paintLayer.noStroke();
    paintLayer.strokeWeight(100);
    paintLayer.stroke(255,0,255,0.4);
    paintLayer.line(mouseX, mouseY, pmouseX, pmouseY);

        }

        else {
          traceLayer.blendMode(BLEND);
          traceLayer.strokeWeight(100);
          traceLayer.stroke(255,0,0,0.4);
          traceLayer.line(mouseX, mouseY, pmouseX, pmouseY);
          traceLayer.blendMode(LIGHTEST);

              }



      }
