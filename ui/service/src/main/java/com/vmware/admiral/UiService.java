/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 *
 * This product is licensed to you under the Apache License, Version 2.0 (the "License").
 * You may not use this product except in compliance with the License.
 *
 * This product may include a number of subcomponents with separate copyright notices
 * and license terms. Your use of these subcomponents is subject to the terms and
 * conditions of the subcomponent's license, as noted in the LICENSE file.
 */

package com.vmware.admiral;

import com.vmware.admiral.common.ManagementUriParts;
import com.vmware.xenon.common.Operation;
import com.vmware.xenon.common.UriUtils;

public class UiService extends BaseUiService {
    public static final String SELF_LINK = ManagementUriParts.UI_SERVICE;

    private static final String OLD_COMPUTE_UI_QUERY = "compute";

    @Override
    public void handleStart(Operation startPost) {
        super.handleStart(startPost);

        startForwardingService(UriUtils.buildUriPath(SELF_LINK, "assets/i18n/base"),
                UriUtils.buildUriPath(ManagementUriParts.UI_OG_SERVICE, "messages/admiral"));
        startForwardingService(UriUtils.buildUriPath(SELF_LINK, LOGIN_PATH, "assets/i18n/base"),
                UriUtils.buildUriPath(ManagementUriParts.UI_OG_SERVICE, "messages/admiral"));
        startForwardingService(UriUtils.buildUriPath(SELF_LINK, LOGIN_PATH, "assets/i18n"),
                UriUtils.buildUriPath(SELF_LINK, "assets/i18n"));

        String loginServicePath = UriUtils.buildUriPath(SELF_LINK, LOGIN_PATH);
        if (!loginServicePath.endsWith(UriUtils.URI_PATH_CHAR)) {
            loginServicePath += UriUtils.URI_PATH_CHAR;
        }

        String uiServicePath = ManagementUriParts.UI_SERVICE;
        if (!uiServicePath.endsWith(UriUtils.URI_PATH_CHAR)) {
            uiServicePath += UriUtils.URI_PATH_CHAR;
        }

        startForwardingService(loginServicePath, uiServicePath);

        // TODO: remove after new UI is active in CS
        startRedirectService(UriUtils.buildUriPath(SELF_LINK, "/index-embedded.html"),
                UriUtils.buildUriPath(ManagementUriParts.UI_OG_SERVICE, "/index-embedded.html"));
    }

    @Override
    public void handleGet(Operation get) {
        if (redirectToLoginOrIndex(getHost(), get)) {
            return;
        }
        if (redirectToIaaS(get)) {
            return;
        }
        super.handleGet(get);
    }

    private static boolean redirectToIaaS(Operation op) {
        String query = op.getUri().getQuery();
        if (query != null && query.contains(OLD_COMPUTE_UI_QUERY)) {

            String location = ManagementUriParts.UI_COMPUTE_SERVICE.replace(SELF_LINK, "");

            op.addResponseHeader(Operation.LOCATION_HEADER, location);
            op.setStatusCode(Operation.STATUS_CODE_MOVED_TEMP);
            op.complete();
            return true;
        }

        return false;
    }
}
