(function () {

  'use strict';

  angular
    .module('mseditor')
    .service('adapterService', adapterService);

  adapterService.$inject = [
    '$http',
    '$q',
    '$window',
    'RELAY_CONFIG'
  ];

  function adapterService(
    $http,
    $q,
    $window,
    RELAY_CONFIG) {
    var service = {
      getCampaign: getCampaign,
      campaignSaveChanges: campaignSaveChanges,
      campaignSaveChangesAsTemplate: campaignSaveChangesAsTemplate,
      getCampaignRssPreview: getCampaignRssPreview,
      deleteImages: deleteImages,
      getImagesForCampaign: getImagesForCampaign,
      getPreviewImage: getPreviewImage,
      getPreviewImageWithPlay: getPreviewImageWithPlay,
      getSettings: getSettings,
      refreshMercadoShopsProductServiceToken: refreshMercadoShopsProductServiceToken,
      getTiendaNubeProducts: getTiendaNubeProducts,
      overrideUploadFiles: overrideUploadFiles
    };
    
    var langKey = null;
    var loginSession = null;
    var apiToken = null;
    init();

    return service;

    function init() {
      langKey = getPreferredLanguage();
      loginSession = getStoredSession('relayLogin');
      apiToken = getStoredToken('jwtToken');
    };

    function getStoredSession(storageName) {
      var storedSession = angular.fromJson($window.localStorage.getItem(storageName));
      if (!storedSession) {
        logOut();
      }
      return storedSession;
    }
    
    function getStoredToken(tokenName) {
      var storedToken = $window.localStorage.getItem(tokenName);
      if (!storedToken) {
        logOut();
      }
      return storedToken;
    }

    function getPreferredLanguage() {
      var key = $window.localStorage.getItem('lang');
      return key || 'en';
    };

    function logOut() {
      $window.location = "/";
    }

    /**
     * Return a preview placeholder image
     * @argument {Object} params - Configuration object
     * @argument {string} params.fileName - The file name and extension
     * @argument {string} params.providerName - The provider name
     * @argument {number} params.idCampaign - The campaign identifier
     * @argument {number} params.idTemplate - The template identifier
     * @example
     * ```js
     * var params = {
     *   fileName: 'testFile.jpg',
     *   providerName: 'Youtube',
     *   idCampaign: 1,
     *   idTemplate: 2
     * };
     * 
     * adapterService.getPreviewImageWithPlay(params);
     * ```
     */
    function getPreviewImageWithPlay(params) {
      traceAdapterCall(getPreviewImageWithPlay, arguments);
      var response = {
        ThumbnailUrlWithPlay: 'https://i.vimeocdn.com/filter/overlay?src0=http://www.wpclipart.com/travel/US_Road_Signs/info/temporary.png&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png'
      };
      return $q.resolve(response);
    }

    /**
     * Return a preview image from a video
     * @argument {Object} params - Configuration object
     * @argument {string} params.url - The video url
     * @argument {boolean} params.addPlayButton - Flag to check if thumbnail video is added
     * @argument {number} params.idCampaign - The campaign identifier
     * @argument {number} params.idTemplate - The template identifier
     * @argument {string} [ThumbnailUrlWithPlay] - The thumbnail url
     * @example
     * ```js
     * var params = {
     *   url: 'http://test.url',
     *   addPlayButton: true,
     *   idCampaign: 1,
     *   idTemplate: 2,
     *   ThumbnailUrlWithPlay: 'http://vimeocdn.url'
     * };
     * 
     * adapterService.getPreviewImage(params);
     * ```
     */
    function getPreviewImage(params) {
      traceAdapterCall(getPreviewImage, arguments);
      var response = {
        ThumbnailUrl: 'https://i.vimeocdn.com/video/699535210.webp',
        Title: 'Test video',
        ProviderName: 'Youtube',
        ThumbnailUrlWithPlay: 'https://i.vimeocdn.com/filter/overlay?src=https://i.vimeocdn.com/video/699535210.webp&src=https://integrationstore-b0c3f53658fe7a75.microservice.createsend.com/files/9392B9D9-F380-42FC-9571-7E109B7A1C26/youtube-play-button-overlay.png'
      };
      return $q.resolve(response);
    }

    /**
     * Return a preview images to image gallery
     * @argument {number} start - The initial position index 
     * @argument {number} howMany - The offset position
     * @argument {Object} query - The query model to filter from gallery
     * @argument {string} sortingCriteria - The image sorting criteria
     * @example
     * ```js
     * var start = 1;
     * var howMany = 1;
     * var query = {
     *   query: ''
     * };
     * var sortingCriteria = "DATE";
     * 
     * adapterService.getImagesForCampaign(start, howMany, query, sortingCriteria);
     * ```
     */
    function getImagesForCampaign(start, howMany, query, sortingCriteria) {
      traceAdapterCall(getImagesForCampaign, arguments);
      var images = [{
        name: 'fakeImage1.jpg',
        lastModifiedDate: '2015-11-14T06:35:42.239Z',
        size: 1024,
        type: '.jpg',
        url: 'http://cdn.fromdoppler.com/relay-demo-content/fakeImage1.jpg',
        thumbnailUrl: 'http://cdn.fromdoppler.com/relay-demo-content/fakeImage1.jpg',
        thumbnailUrl150: 'http://cdn.fromdoppler.com/relay-demo-content/fakeImage1.jpg'
      }];
      var response = {
        data: {
          images: images,
          count: 1
        }
      };
      return $q.resolve(response);
    }

    /**
     * Return an array of promises to delete individual images
     * @argument {Object[]} params - Array of image json objects
     * @argument {string} params[].name - The file name and extension
     * @argument {string} params[].lastModifiedDate - The timestamp of the last modification date
     * @argument {number} params[].size - The size of the file
     * @argument {string} params[].type - The file extension
     * @argument {string} params[].url - The image url
     * @argument {string} params[].thumbnailUrl - The image thumbnail url 
     * @argument {string} params[].thumbnailUrl150 - The image thumbnail url used in videos
     * @example
     * ```js
     * var filenames = [
     *   {
     *      name: 'image1.jpg',
     *      lastModifiedDate: '2015-11-14T06:35:42.239Z',
     *      size: 1024,
     *      type: '.jpg',
     *      url: 'uploads/image1.jpg',
     *      thumbnailUrl: 'uploads/image1.jpg',
     *      thumbnailUrl150: 'uploads/image1.jpg'
     *   },
     *   {
     *      name: 'image2.jpg',
     *      lastModifiedDate: '2015-11-14T06:35:42.239Z',
     *      size: 332,
     *      type: '.jpg',
     *      url: 'uploads/image2.jpg',
     *      thumbnailUrl: 'uploads/image2.jpg',
     *      thumbnailUrl150: 'uploads/image2.jpg'
     *   }
     * ];
     * 
     * adapterService.deleteImages(filenames);
     * ```
     */
    function deleteImages(filenames) {
      traceAdapterCall(deleteImages, arguments);
      var response = {
        success: true,
        error: false
      }
      return $q.all([$q.resolve(response)]);
    }

    /**
     * Return parsed html rss tags in editor with rss feed
     * @argument {number} idCampaign - The identifier number of campaign 
     * @argument {string} subjectCampaign - The subject campaign
     * @argument {string} html - The body content of campaign
     * @example
     * ```js
     * var idCampaign = 1;
     * var subjectCampaign = "example";
     * var html = "<div><h1>Hello World!</h1></div>";
     * 
     * adapterService.getCampaignRssPreview(idCampaign, subjectCampaign, html);
     * ```
     */
    function getCampaignRssPreview(idCampaign, subjectCampaign, html) {
      traceAdapterCall(getCampaignRssPreview, arguments);
      var rssTags = [
        {
          tagName: 'RSSFEED:TITLE',
          tagReplace: 'Nuevo Ebook: Conquista a tu audiencia con contenidos irresistible'
        },
        {
          tagName: 'RSSFEED:ITEMS',
          tagReplace: ''
        },
        {
          tagName: 'RSSFEED:ENDITEMS',
          tagReplace: ''
        },
        {
          tagName: 'RSSFEED:DESCRIPTION',
          tagReplace: '¿Quieres dar a conocer tu marca, atraer clientes y diferenciarte de tu competencia? El Marketing de Contenidos y este super eBook gratuito pueden ayudarte a lograrlo. ¡Enterate más!'
        },
        {
          tagName: 'RSSITEM:TITLE',
          tagReplace: 'Nuevo Ebook: Conquista a tu audiencia con contenidos irresistible'
        },
        {
          tagName: 'RSSITEM:CONTENT',
          tagReplace: '¿Quieres dar a conocer tu marca, atraer clientes y diferenciarte de tu competencia? El Marketing de Contenidos y este super eBook gratuito pueden ayudarte a lograrlo. ¡Enterate más! Hace tiempo que la publicidad  no tiene el impacto que solía tener. Las personas ya no creen en lo que las empresas dicen sobre sus propios productos. Y eso es obvio, ¿verdad?'
        },
        {
          tagName: 'RSSITEM:URL',
          tagReplace: 'http://www.google.com.ar/'
        }
      ];
      rssTags.forEach(function (tagObj) {
        html = html.replace(new RegExp('\\[\\[\\[' + tagObj.tagName + '\\]\\]\\]', 'g'), tagObj.tagReplace);
      });
      var response = {
        success: true,
        errorMessage: '',
        subjectCampaign: '',
        html: html
      };
      return $q.resolve(response);
    }

    /**
     * Return campaign state and convert/create in template at template folder
     * @argument {Object} params - Configuration object
     * @argument {Object} params.campaign - The campain object representation
     * @argument {boolean} params.redirectedFromSummary - Flag for redirection
     * @argument {boolean} params.idABTest - Flag to check if idABTest location exists
     * @argument {boolean} [params.isTemplate] - Flag to identify like a template
     * @example
     * ```js
     * var params = {
     *   campaign: {
     *    id: 1,
     *    name: 'Campaign Name'
     *    // This json object continues with more properties from CampaignComponent
     *   },
     *   redirectedFromSummary: true,
     *   idABTest: false
     *   isTemplate: true
     * };
     * 
     * adapterService.campaignSaveChangesAsTemplate(params);
     * ```
     */
    function campaignSaveChangesAsTemplate(params) {
      traceAdapterCall(campaignSaveChangesAsTemplate, arguments);
      saveTemplateChanges(params);
      
      var savedCampaignAsTemplate = {
        Success: true,
        ErrorMessage: '',
        UrlToRedirect: 'http://www.google.com/',
        IdTemplate: 1
      }
      return savedCampaignAsTemplate;
    }

    function saveTemplateChanges(params) {
      var templateBody = {
        'mseditor': {
          'attributes' : params.campaign.attributes,
          'settings' : params.campaign.attributes,
          'children' : params.campaign.children,
        },
        'html' : params.campaign.html,
        'name': params.campaign.name
      };
      $http({
        actionDescription: 'saving mseditor template',
        method: 'PUT',
        data: {
          'html': templateBody.html,
          'mseditor':  templateBody.mseditor 
        },
        url: RELAY_CONFIG.baseUrl + '/accounts/' + loginSession.accountId + '/templates/' + params.campaign.id + '/body',
        headers: {
          'Authorization': 'Bearer '+ apiToken
        }
      })
      .catch(function(error) {
        var errorDetail = error.data && error.data.detail || "Unexpected error";
        console.log(errorDetail);
        return $q.reject(error); 
      });
    }

    /**
     * Return save success flag and url to redirect when edit step is finished
     * @argument {Object} params - Configuration object
     * @argument {Object} params.campaign - The campain object representation
     * @argument {boolean} params.redirectedFromSummary - Flag for redirection
     * @argument {boolean} params.idABTest - Flag to check if idABTest location exists
     * @argument {string} [params.templateName] - The template name
     * @example
     * ```js
     * var params = {
     *   campaign: {
     *    {
     *      id: 1,
     *      name: 'Campaign Name'
     *      // This json object continues with more properties from CampaignComponent
     *    }
     *   },
     *   redirectedFromSummary: true,
     *   idABTest: true
     *   templateName: 'template1'
     * };
     * 
     * adapterService.campaignSaveChanges(params);
     * ```
     */
    function campaignSaveChanges(params) {
      traceAdapterCall(campaignSaveChanges, arguments);
      var savedCampaign = {
        data: {
          Success: true,
          ErrorMessage: '',
          UrlToRedirect: 'http://www.google.com/'
        }
      }
      return $q.resolve(savedCampaign);
    }

    /**
     * Get json with campaign configuration
     * @argument {number} id - The identifier of campaign or template
     * @argument {boolean} useEditorAsTemplate - Flag to use editor as a template
     * @example
     * ```js
     * var id = 1;
     * var useEditorAsTemplate = true;
     * 
     * adapterService.getCampaign(id, useEditorAsTemplate);
     * ```
     */
    function getCampaign(id, useEditorAsTemplate) {
      traceAdapterCall(getCampaign, arguments);
      // TODO This is a temporary url reference to the current backend syntax call
      return $http.get(RELAY_CONFIG.baseUrl + '/accounts/' + loginSession.accountId + '/templates/' + id, {
        headers: {
          'Authorization': 'Bearer '+ apiToken
        }
      }).then(function(response) {
        var campaign = {
          id: id,
          type: 'campaign',
          name: 'Campaign ' + id,
          attributes: {},
          innerHTML: '',
          children: []
        };
        return { data: campaign };
      },
      function(error) {
        var errorDetail = error.data && error.data.detail || "Unexpected error";
        console.log(errorDetail);
        return $q.reject(error);
      });
    }
    /**
     * Return settings from json to configure language, 3rd service tokens, and url links
     * @argument {number} idCampaign - The campaign identifier
     * @argument {number} idTemplate - The template identifier
     * @example
     * ```js
     * var idCampaign = 1;
     * var idTempalte = 1;
     * 
     * adapterService.getSettings(idCampaign, idTemplate);
     * ```
     */
    function getSettings(idCampaign, idTemplate) {
      traceAdapterCall(getSettings, arguments);
      var msEditorSettings = {
        language: langKey,
        redirectUrl: "/",
        sharedSocialNetworks: [],
        stores: [],
        rssCampaign: false,
        rssShowPreview: false
      };
      return $q.resolve(msEditorSettings);
    }

    /** Returns a mercado shop token
     * @example
     * ```js
     * adapterService.refreshMercadoShopsProductServiceToken();
     * ```
    */
    function refreshMercadoShopsProductServiceToken() {
      traceAdapterCall(refreshMercadoShopsProductServiceToken, arguments);
      return $q.resolve("fakeToken");
    }

    /**
     * Get products json from tienda nube and set in a header a products counter
     * @argument {string} storeId - The credential store id
     * @argument {string} accessToken - Credential access token
     * @argument {number} page - The page number
     * @argument {number} limit - The products ordered on each call quantity
     * @argument {string} sortBy - The sorting criteria
     * @argument {Object} query - The query model to filter from gallery
     * @example
     * ```js
     * var storeId = 1;
     * var accessToken = "tokenExample";
     * var page = 1;
     * var limit = 1;
     * var sortBy = "DATE"
     * var query = {
     *   query: ''
     * };
     * 
     * adapterService.getTiendaNubeProducts(storeId, accessToken, page, limit, sortBy, query);
     * ```
     */
    function getTiendaNubeProducts(storeId, accessToken, page, limit, sortBy, query) {
      traceAdapterCall(getTiendaNubeProducts, arguments);
      return $q.resolve({});
    }

    /**
     * Overriding of DropZone's uploadFiles function
     * 
     * See https://github.com/MakingSense/MSEditor/pull/1259
     * 
     * @param {File[]} files 
     */
    function overrideUploadFiles(files) {
      traceAdapterCall(overrideUploadFiles, arguments);

      var file, formData, handleError, headerName, headerValue, headers, i, input, inputName, inputType, key, method, option, progressObj, response, updateProgress, url, value, xhr, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

      // DropZone's original code:
      // method = resolveOption(this.options.method, files);
      method = 'POST';

      // DropZone's original code:
      // url = resolveOption(this.options.url, files);
      url = 'images';


      // DropZone's original code:
      // xhr = new XMLHttpRequest();
      xhr = new XMLHttpRequestDouble();

      // All the rest of the code was taken as it was from DropZone's
      // Maybe it could be simplified based in our specific requirements
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.xhr = xhr;
      }
      xhr.open(method, url, true);
      xhr.withCredentials = !!this.options.withCredentials;
      response = null;
      handleError = (function (_this) {
        return function () {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
            file = files[_j];
            _results.push(_this._errorProcessing(files, response || _this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr));
          }
          return _results;
        };
      })(this);
      updateProgress = (function (_this) {
        return function (e) {
          var allFilesFinished, progress, _j, _k, _l, _len1, _len2, _len3, _results;
          if (e != null) {
            progress = 100 * e.loaded / e.total;
            for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
              file = files[_j];
              file.upload = {
                progress: progress,
                total: e.total,
                bytesSent: e.loaded
              };
            }
          } else {
            allFilesFinished = true;
            progress = 100;
            for (_k = 0, _len2 = files.length; _k < _len2; _k++) {
              file = files[_k];
              if (!(file.upload.progress === 100 && file.upload.bytesSent === file.upload.total)) {
                allFilesFinished = false;
              }
              file.upload.progress = progress;
              file.upload.bytesSent = file.upload.total;
            }
            if (allFilesFinished) {
              return;
            }
          }
          _results = [];
          for (_l = 0, _len3 = files.length; _l < _len3; _l++) {
            file = files[_l];
            _results.push(_this.emit("uploadprogress", file, progress, file.upload.bytesSent));
          }
          return _results;
        };
      })(this);
      xhr.onload = (function (_this) {
        return function (e) {
          var _ref;
          if (files[0].status === Dropzone.CANCELED) {
            return;
          }
          if (xhr.readyState !== 4) {
            return;
          }
          response = xhr.responseText;
          if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
            try {
              response = JSON.parse(response);
            } catch (_error) {
              e = _error;
              response = "Invalid JSON response from server.";
            }
          }
          updateProgress();
          if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
            return handleError();
          } else {
            return _this._finished(files, response, e);
          }
        };
      })(this);
      xhr.onerror = (function (_this) {
        return function () {
          if (files[0].status === Dropzone.CANCELED) {
            return;
          }
          return handleError();
        };
      })(this);
      progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
      progressObj.onprogress = updateProgress;
      headers = {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      };
      if (this.options.headers) {
        extend(headers, this.options.headers);
      }
      for (headerName in headers) {
        headerValue = headers[headerName];
        if (headerValue) {
          xhr.setRequestHeader(headerName, headerValue);
        }
      }
      formData = new FormData();
      if (this.options.params) {
        _ref1 = this.options.params;
        for (key in _ref1) {
          value = _ref1[key];
          formData.append(key, value);
        }
      }
      for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
        file = files[_j];
        this.emit("sending", file, xhr, formData);
      }
      if (this.options.uploadMultiple) {
        this.emit("sendingmultiple", files, xhr, formData);
      }
      if (this.element.tagName === "FORM") {
        _ref2 = this.element.querySelectorAll("input, textarea, select, button");
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          input = _ref2[_k];
          inputName = input.getAttribute("name");
          inputType = input.getAttribute("type");
          if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
            _ref3 = input.options;
            for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
              option = _ref3[_l];
              if (option.selected) {
                formData.append(inputName, option.value);
              }
            }
          } else if (!inputType || ((_ref4 = inputType.toLowerCase()) !== "checkbox" && _ref4 !== "radio") || input.checked) {
            formData.append(inputName, input.value);
          }
        }
      }
      for (i = _m = 0, _ref5 = files.length - 1; 0 <= _ref5 ? _m <= _ref5 : _m >= _ref5; i = 0 <= _ref5 ? ++_m : --_m) {
        formData.append(this._getParamName(i), files[i], files[i].name);
      }
      return this.submitRequest(xhr, formData, files);
    };

    /**
      * Private function used by overrideUploadFiles
      */
    function resolveOption() {
      var __slice = [].slice;
      var args, option;
      option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (typeof option === 'function') {
        return option.apply(this, args);
      }
      return option;
    };

    /**
     * Double of XMLHttpRequest for prototyping
     */
    function XMLHttpRequestDouble() {
      var self = {
        status: 201,
        readyState: 0,
        responseText: '',
        open: open,
        send: send,
        setRequestHeader: setRequestHeader,
        getResponseHeader: getResponseHeader
      };

      return self;

      function open(method, url) {
        traceAdapterCall(self.open, arguments);
      };

      function send(data) {
        traceAdapterCall(self.send, arguments);
        setTimeout(function () {
          var e = {
            loaded: 20,
            total: 100
          };
          self.onprogress(e);
        }, 1000);

        setTimeout(function () {
          var e = {
            loaded: 60,
            total: 100
          };
          self.onprogress(e);
        }, 4000);

        setTimeout(function () {
          var e = {
            loaded: 60,
            total: 100
          };
          self.readyState = 4; // Request Completed

          //self.onprogress(e);                  
          //self.onload(e);

          self.status = 408; //Request Timeout
          self.onerror(e);
        }, 6000);
      };

      function setRequestHeader(key, value) {
        traceAdapterCall(self.setRequestHeader, arguments);
      };

      function getResponseHeader(key) {
        traceAdapterCall(self.getResponseHeader, arguments);
        return '';
      };
    };

    /** Ugly function to easily log calls to not implemented functions */
    function traceAdapterCall(func, funcArgs) {
      console.log(func.name, funcArgs);
    }
  }
})();
