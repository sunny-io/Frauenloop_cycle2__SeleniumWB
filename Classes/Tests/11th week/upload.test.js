const { assert } = require("chai");
const forEach = require("mocha-each");
const path = require("path");
const Upload = require("./UploadFile");
const data = require("./data.json");
const { chromeUpload, firefoxUpload, safariUpload } = require("./strategies");

const chromeObj = new chromeUpload();
const firefoxObj = new firefoxUpload();
const safariObj = new safariUpload();

[safariObj, firefoxObj, chromeObj].forEach((objct) => {
  describe("Testing in " + objct.browser, function () {
    //remove --no-timeouts
    this.timeout(0);

    before(async function () {
      //await objct.open()
      //await objct.max();
    });

    beforeEach(async function () {
      await objct.open();
      await objct.max();

      //await objct.max();
    });

    after(async function () {
      //await objct.close()
    });

    afterEach(async function () {
      await objct.close();
    });

    data.forEach((data) => {
      it("Uploading " + data.file, async function () {
        let type = data.type;
        let file = data.file;
        let filePath = path.resolve("./11th week/resources/" + file);

        await objct.setInput("fileinput", filePath);
        if (type == "image") {
          await objct.click("itsanimage");
        } else {
          await objct.click("itsafile");
        }
        await objct.submit();

        let title = await objct.getTitle();
        assert.equal(title, "File Upload - Upload Results | Test Pages");

        let txt = await objct.getTxt("uploadedfiletype");
        assert.equal(txt, type);

        txt = await objct.getTxt("uploadedfilename");
        assert.equal(txt, file);
      });
    });
  });
});
