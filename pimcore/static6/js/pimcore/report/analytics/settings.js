/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2014 pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.report.analytics.settings");
pimcore.report.analytics.settings = Class.create({

    initialize: function (parent) {
        this.parent = parent;
    },

    getKey: function () {
        return "analytics";
    },

    getLayout: function () {

        this.panel = new Ext.FormPanel({
            title: "Google Analytics",
            bodyStyle: "padding: 10px;",
            autoScroll: true,
            items: [
                {
                    xtype: "displayfield",
                    width: 400,
                    hideLabel: true,
                    value: t("analytics_notice"),
                    cls: "pimcore_extra_label",
                    fieldStyle: {
                        color: "#ff0000"
                    }
                },
                {
                    xtype: "displayfield",
                    width: 400,
                    hideLabel: true,
                    value: "&nbsp;<br />" + t("analytics_settings_description") + "<br /><br />"
                                           + t('only_required_for_reporting_in_pimcore_but_not_for_code_integration'),
                    cls: "pimcore_extra_label"
                },
                {
                    xtype: "panel",
                    style: "padding:30px 0 0 0;",
                    border: false,
                    items: this.getConfigurations()
                }
            ]
        });

        return this.panel;
    },

    getConfigurations: function () {

        this.configCount = 0;
        var configs = [];
        var sites = pimcore.globalmanager.get("sites");

        sites.each(function (record) {
            var id = record.data.id;
            var key = "site_" + id;
            if(!id) {
                id = "default";
                key = "default";
            }
            configs.push(this.getConfiguration(key, record.data.domain, id));
        }, this);

        return configs;
    },

    getConfiguration: function (key, name, id) {

        id = id + "";
        var itemId = id.replace(/\./g, '_');
        var config = {
            xtype: "fieldset",
            defaults: {
                labelWidth: 300
            },
            title: name,
            items: [
                {
                    xtype: "textfield",
                    fieldLabel: t("analytics_trackid_code"),
                    name: "trackid_" + id,
                    width: 670,
                    id: "report_settings_analytics_trackid_" + itemId,
                    value: this.parent.getValue("analytics.sites." + key + ".trackid")
                },{
                    xtype: "fieldset",
                    collapsible: true,
                    collapsed: true,
                    title: t("code_settings"),
                    defaults: {
                        labelWidth: 300
                    },
                    items: [{
                        xtype: "textarea",
                        fieldLabel: t("analytics_universal_configuration"),
                        name: "universal_configuration_" + id,
                        height: 100,
                        width: 650,
                        id: "report_settings_analytics_universal_configuration_" + itemId,
                        value: this.parent.getValue("analytics.sites." + key + ".universal_configuration")
                    },{
                        xtype: "textarea",
                        fieldLabel: t("code_before_init"),
                        name: "additionalcodebeforeinit" + id,
                        height: 100,
                        width: 650,
                        id: "report_settings_analytics_additionalcodebeforeinit_" + itemId,
                        value: this.parent.getValue("analytics.sites." + key + ".additionalcodebeforeinit")
                    },{
                        xtype: "textarea",
                        fieldLabel: t("code_before_pageview"),
                        name: "additionalcodebeforepageview" + id,
                        height: 100,
                        width: 650,
                        id: "report_settings_analytics_additionalcodebeforepageview_" + itemId,
                        value: this.parent.getValue("analytics.sites." + key + ".additionalcodebeforepageview")
                    },{
                        xtype: "textarea",
                        fieldLabel: t("code_after_pageview"),
                        name: "additionalcode_" + id,
                        height: 100,
                        width: 650,
                        id: "report_settings_analytics_additionalcode_" + itemId,
                        value: this.parent.getValue("analytics.sites." + key + ".additionalcode")
                    },{
                        xtype: "checkbox",
                        fieldLabel: t("analytics_asynchronous_code"),
                        name: "asynchronouscode_" + id,
                        id: "report_settings_analytics_asynchronouscode_" + itemId,
                        checked: this.parent.getValue("analytics.sites." + key + ".asynchronouscode")
                    },{
                        xtype: "checkbox",
                        fieldLabel: t("analytics_retargeting_code"),
                        name: "retargetingcode_" + id,
                        id: "report_settings_analytics_retargetingcode_" + itemId,
                        checked: this.parent.getValue("analytics.sites." + key + ".retargetingcode")
                    }]
                },{
                    xtype: "fieldset",
                    collapsible: true,
                    collapsed: true,
                    title: t("advanced_integration"),
                    defaults: {
                        labelWidth: 300
                    },
                    items: [{
                        xtype: "displayfield",
                        hideLabel: true,
                        width: 650,
                        style: "margin-top:20px;",
                        value: t('only_required_for_reporting_in_pimcore_but_not_for_code_integration'),
                        cls: "pimcore_extra_label_bottom"
                    },{
                        xtype:'combo',
                        fieldLabel: t('profile'),
                        typeAhead:true,
                        displayField: 'name',
                        store: new Ext.data.Store({
                            autoDestroy: true,
                            autoLoad: false,
                            proxy: {
                                type: 'ajax',
                                url: "/admin/reports/analytics/get-profiles",
                                reader: {
                                    type: 'json',
                                    rootProperty: "data"
                                }
                            },
                            fields: ["name","id","trackid","accountid","internalid"],
                            listeners: {
                                load: function(id) {
                                    var cmp = Ext.getCmp("report_settings_analytics_profile_" + id);
                                    cmp.setValue(this.parent.getValue("analytics.sites." + key + ".profile"));
                                }.bind(this, itemId)
                            }
                        }),
                        listeners: {
                            "select": function (id, el, record, index) {
                                Ext.getCmp("report_settings_analytics_trackid_" + id).setValue(record.get("trackid"));
                                Ext.getCmp("report_settings_analytics_accountid_" + id).setValue(record.get("accountid"));
                                Ext.getCmp("report_settings_analytics_internalid_" + id).setValue(record.get("internalid"));
                            }.bind(this, itemId)
                        },
                        valueField: 'id',
                        width: 650,
                        forceSelection: true,
                        triggerAction: 'all',
                        hiddenName: 'profile_' + id,
                        id: "report_settings_analytics_profile_" + itemId,
                        value: this.parent.getValue("analytics.sites." + key + ".profile")
                    },{
                        xtype: "textfield",
                        fieldLabel: t("analytics_accountid"),
                        name: "accountid_" + id,
                        width: 650,
                        id: "report_settings_analytics_accountid_" + itemId,
                        value: this.parent.getValue("analytics.sites." + key + ".accountid")
                    },{
                        xtype: "textfield",
                        fieldLabel: t("analytics_internalid"),
                        width: 650,
                        name: "internalid_" + id,
                        id: "report_settings_analytics_internalid_" + itemId,
                        value: this.parent.getValue("analytics.sites." + key + ".internalid")
                    }]
                }
            ]
        };

        return config;
    },

    getValues: function () {

        var formData = this.panel.getForm().getFieldValues();
        var sites = pimcore.globalmanager.get("sites");
        var sitesData = {};

        sites.each(function (record) {
            var id = record.data.id;
            var key = "site_" + id;
            if(!id) {
                id = "default";
                key = "default";
            }

            sitesData[key] = {
                profile: Ext.getCmp("report_settings_analytics_profile_" + id).getValue(),
                trackid: Ext.getCmp("report_settings_analytics_trackid_" + id).getValue(),
                asynchronouscode: Ext.getCmp("report_settings_analytics_asynchronouscode_" + id).getValue(),
                retargetingcode: Ext.getCmp("report_settings_analytics_retargetingcode_" + id).getValue(),
                additionalcode: Ext.getCmp("report_settings_analytics_additionalcode_" + id).getValue(),
                additionalcodebeforepageview: Ext.getCmp("report_settings_analytics_additionalcodebeforepageview_" + id).getValue(),
                additionalcodebeforeinit: Ext.getCmp("report_settings_analytics_additionalcodebeforeinit_" + id).getValue(),
                accountid: Ext.getCmp("report_settings_analytics_accountid_" + id).getValue(),
                internalid: Ext.getCmp("report_settings_analytics_internalid_" + id).getValue(),
                universal_configuration: Ext.getCmp("report_settings_analytics_universal_configuration_" + id).getValue()
            };
        }, this);

        var values = {
            sites: sitesData
        };

        return values;
    }
});


pimcore.report.settings.broker.push("pimcore.report.analytics.settings");
