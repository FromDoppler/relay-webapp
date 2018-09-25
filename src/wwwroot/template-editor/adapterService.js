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
      getTiendaNubeProducts: getTiendaNubeProducts
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
      service.dropzoneConfig = {
        url : RELAY_CONFIG.baseUrl + '/accounts/' + loginSession.accountName + '/files',
        headers: {
          'Authorization': 'Bearer ' + apiToken
        }
      };
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
     * Return the Image Gallery
     * @argument {Object} params - Configuration object
     * @argument {string} params.query - The file name and extension
     * @argument {string} params.position - The provider name
     * @argument {number} params.offset - The campaign identifier
     * @argument {number} params.sortingCriteria - The template identifier
     * @argument {number} params.isAscending - The template identifier
     * @example
     * ```js
     * var params = {
     *   fileName: 'testFile.jpg',
     *   providerName: 'Youtube',
     *   idCampaign: 1,
     *   idTemplate: 2
     * };
     * 
     * adapterService.getImagesForCampaign(params);
     * ```
     */
    function getImagesForCampaign(start, howMany, query, sortingCriteria) {
      traceAdapterCall(getImagesForCampaign, arguments);
      var page = Math.trunc(start / howMany) + 1;
      var order,
          sortBy;
      if (sortingCriteria) {
        order = sortingCriteria.isAscending ? 'asc' : 'desc';
        sortBy = sortingCriteria.value.toLowerCase() === 'date' ? 'date' : 'name';
      } else {
        order = null;
        sortBy = null;
      }
      return $http({
        actionDescription: 'Getting image Gallery',
        method: 'GET',
        params: {
          query : query || '',
          per_page : howMany,
          page : page,
          sortBy : sortBy,
          order : order,
          onlyImages : true
        },
        url: RELAY_CONFIG.baseUrl + '/accounts/' + loginSession.accountName + '/files',
        headers: {
          'Authorization': 'Bearer ' + apiToken
        }
      })
      .then(function(response){
        return { data : { images : response.data.items, count : response.data.itemsCount }};
      })
      .catch(function(error) {
        var errorDetail = error.data && error.data.detail || "Unexpected error";
        console.log(errorDetail);
        return $q.reject(error); 
      });
    };

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
      return saveTemplateContentChanges(params).then(function() {
        var url = $window.location.origin + '/#/templates/' + params.campaign.id;
        var savedCampaignAsTemplate = {
          Success: true,
          ErrorMessage: '',
          UrlToRedirect: url,
          IdTemplate: params.campaign.id
        }
        return savedCampaignAsTemplate;
      });
    }

    function saveTemplateContentChanges(params) {
      return $http({
        actionDescription: 'saving mseditor template',
        method: 'PUT',
        data: {
          'mseditor': {
            'attributes' : params.campaign.attributes,
            'settings' : params.campaign.attributes,
            'children' : params.campaign.children,
          },
          'html' : params.campaign.html
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
       return saveTemplateContentChanges(params).then(function() {
        var url = $window.location.origin + '/#/templates/' + params.campaign.id;
        var savedCampaign = {
          data: {
            Success: true,
            ErrorMessage: '',
            UrlToRedirect: url
          }
        }
        return savedCampaign;
       });
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

      return $http.get(RELAY_CONFIG.baseUrl + '/accounts/' + loginSession.accountId + '/templates/' + id + '/body', {
        headers: {
          'Authorization': 'Bearer '+ apiToken
        }
      }).then(function(response) {
        var campaign = {
          id: id,
          type: 'campaign',
          name: response.data.name,
          html: response.data.html,
          attributes: response.data.mseditor ? response.data.mseditor.attributes : null,
          settings: response.data.mseditor ? response.data.mseditor.settings : null,
          children: response.data.mseditor ? response.data.mseditor.children : null
        };
        return { data: campaign };
      }).catch(function(reason) {
        var reasonDetail = reason.data && reason.data.detail || "Unexpected error";
        console.log(reasonDetail);
        return $q.reject(reason);
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

    /** Ugly function to easily log calls to not implemented functions */
    function traceAdapterCall(func, funcArgs) {
      console.log(func.name, funcArgs);
    }
  }
})();
