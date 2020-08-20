import {
  fanIn,
  fanOut,
  fanOut_fanIn,
  group,
  sequence,
  optional,
  repeat,
  choice,
  merge,
  branch,
  terminal
} from "@imaguiraga/topology-dsl-core";

/**
 * Create a gcp_Cloud_Filestore dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Filestore(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Filestore");
}

/**
 * Create a gcp_Cloud_Storage dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Storage(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Storage");
}

/**
 * Create a gcp_Persistent_Disk dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Persistent_Disk(...elts) {
  return terminal(...elts)._subType_("gcp_Persistent_Disk");
}

/**
 * Create a gcp_Cloud_IAM dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_IAM(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_IAM");
}

/**
 * Create a gcp_Cloud_Resource_Manager dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Resource_Manager(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Resource_Manager");
}

/**
 * Create a gcp_Cloud_Security_Command_Center dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Security_Command_Center(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Security_Command_Center");
}

/**
 * Create a gcp_Cloud_Security_Scanner dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Security_Scanner(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Security_Scanner");
}

/**
 * Create a gcp_Key_Management_Service dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Key_Management_Service(...elts) {
  return terminal(...elts)._subType_("gcp_Key_Management_Service");
}

/**
 * Create a gcp_Cloud_Armor dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Armor(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Armor");
}

/**
 * Create a gcp_Cloud_CDN dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_CDN(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_CDN");
}

/**
 * Create a gcp_Cloud_DNS dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_DNS(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_DNS");
}

/**
 * Create a gcp_Cloud_External_IP_Addresses dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_External_IP_Addresses(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_External_IP_Addresses");
}

/**
 * Create a gcp_Cloud_Firewall_Rules dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Firewall_Rules(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Firewall_Rules");
}

/**
 * Create a gcp_Cloud_Load_Balancing dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Load_Balancing(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Load_Balancing");
}

/**
 * Create a gcp_Cloud_NAT dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_NAT(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_NAT");
}

/**
 * Create a gcp_Cloud_Network dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Network(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Network");
}

/**
 * Create a gcp_Cloud_Router dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Router(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Router");
}

/**
 * Create a gcp_Cloud_Routes dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Routes(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Routes");
}

/**
 * Create a gcp_Cloud_VPN dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_VPN(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_VPN");
}

/**
 * Create a gcp_Dedicated_Interconnect dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Dedicated_Interconnect(...elts) {
  return terminal(...elts)._subType_("gcp_Dedicated_Interconnect");
}

/**
 * Create a gcp_Partner_Interconnect dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Partner_Interconnect(...elts) {
  return terminal(...elts)._subType_("gcp_Partner_Interconnect");
}

/**
 * Create a gcp_Premium_Network_Tier dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Premium_Network_Tier(...elts) {
  return terminal(...elts)._subType_("gcp_Premium_Network_Tier");
}

/**
 * Create a gcp_Standard_Network_Tier dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Standard_Network_Tier(...elts) {
  return terminal(...elts)._subType_("gcp_Standard_Network_Tier");
}

/**
 * Create a gcp_Traffic_Director dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Traffic_Director(...elts) {
  return terminal(...elts)._subType_("gcp_Traffic_Director");
}

/**
 * Create a gcp_Virtual_Private_Cloud dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Virtual_Private_Cloud(...elts) {
  return terminal(...elts)._subType_("gcp_Virtual_Private_Cloud");
}

/**
 * Create a gcp_Transfer_Appliance dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Transfer_Appliance(...elts) {
  return terminal(...elts)._subType_("gcp_Transfer_Appliance");
}

/**
 * Create a gcp_Cloud_APIs dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_APIs(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_APIs");
}

/**
 * Create a gcp_Cloud_Billing_API dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Billing_API(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Billing_API");
}

/**
 * Create a gcp_Cloud_Console dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Console(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Console");
}

/**
 * Create a gcp_Cloud_Deployment_Manager dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Deployment_Manager(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Deployment_Manager");
}

/**
 * Create a gcp_Cloud_Mobile_App dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Mobile_App(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Mobile_App");
}

/**
 * Create a gcp_Cloud_Service_Mesh dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Service_Mesh(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Service_Mesh");
}

/**
 * Create a gcp_Cloud_Shell dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Shell(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Shell");
}

/**
 * Create a gcp_Debugger dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Debugger(...elts) {
  return terminal(...elts)._subType_("gcp_Debugger");
}

/**
 * Create a gcp_Error_Reporting dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Error_Reporting(...elts) {
  return terminal(...elts)._subType_("gcp_Error_Reporting");
}

/**
 * Create a gcp_Logging dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Logging(...elts) {
  return terminal(...elts)._subType_("gcp_Logging");
}

/**
 * Create a gcp_Monitoring dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Monitoring(...elts) {
  return terminal(...elts)._subType_("gcp_Monitoring");
}

/**
 * Create a gcp_Profiler dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Profiler(...elts) {
  return terminal(...elts)._subType_("gcp_Profiler");
}

/**
 * Create a gcp_Stackdriver dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Stackdriver(...elts) {
  return terminal(...elts)._subType_("gcp_Stackdriver");
}

/**
 * Create a gcp_Trace dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Trace(...elts) {
  return terminal(...elts)._subType_("gcp_Trace");
}

/**
 * Create a gcp_Cloud_IoT_Core dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_IoT_Core(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_IoT_Core");
}

/**
 * Create a gcp_Stackdriver dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Stackdriver(...elts) {
  return terminal(...elts)._subType_("gcp_Stackdriver");
}

/**
 * Create a gcp_Traffic_Director dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Traffic_Director(...elts) {
  return terminal(...elts)._subType_("gcp_Traffic_Director");
}

/**
 * Create a gcp_Cloud_Build dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Build(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Build");
}

/**
 * Create a gcp_Cloud_Code_for_IntelliJ dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Code_for_IntelliJ(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Code_for_IntelliJ");
}

/**
 * Create a gcp_Cloud_Code dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Code(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Code");
}

/**
 * Create a gcp_Cloud_Scheduler dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Scheduler(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Scheduler");
}

/**
 * Create a gcp_Cloud_SDK dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_SDK(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_SDK");
}

/**
 * Create a gcp_Cloud_Source_Repositories dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Source_Repositories(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Source_Repositories");
}

/**
 * Create a gcp_Cloud_Tasks dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Tasks(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Tasks");
}

/**
 * Create a gcp_Cloud_Test_Lab dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Test_Lab(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Test_Lab");
}

/**
 * Create a gcp_Cloud_Tools_for_Eclipse dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Tools_for_Eclipse(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Tools_for_Eclipse");
}

/**
 * Create a gcp_Cloud_Tools_for_PowerShell dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Tools_for_PowerShell(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Tools_for_PowerShell");
}

/**
 * Create a gcp_Cloud_Tools_for_Visual_Studio dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Tools_for_Visual_Studio(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Tools_for_Visual_Studio");
}

/**
 * Create a gcp_Container_Registry dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Container_Registry(...elts) {
  return terminal(...elts)._subType_("gcp_Container_Registry");
}

/**
 * Create a gcp_Gradle_App_Engine_Plugin dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Gradle_App_Engine_Plugin(...elts) {
  return terminal(...elts)._subType_("gcp_Gradle_App_Engine_Plugin");
}

/**
 * Create a gcp_IDE_Plugins dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_IDE_Plugins(...elts) {
  return terminal(...elts)._subType_("gcp_IDE_Plugins");
}

/**
 * Create a gcp_Maven_App_Engine_Plugin dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Maven_App_Engine_Plugin(...elts) {
  return terminal(...elts)._subType_("gcp_Maven_App_Engine_Plugin");
}

/**
 * Create a gcp_Cloud_Bigtable dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Bigtable(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Bigtable");
}

/**
 * Create a gcp_Cloud_Datastore dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Datastore(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Datastore");
}

/**
 * Create a gcp_Cloud_Firestore dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Firestore(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Firestore");
}

/**
 * Create a gcp_Cloud_Memorystore dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Memorystore(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Memorystore");
}

/**
 * Create a gcp_Cloud_Spanner dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Spanner(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Spanner");
}

/**
 * Create a gcp_Cloud_SQL dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_SQL(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_SQL");
}

/**
 * Create a gcp_BigQuery dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_BigQuery(...elts) {
  return terminal(...elts)._subType_("gcp_BigQuery");
}

/**
 * Create a gcp_Cloud_Composer dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Composer(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Composer");
}

/**
 * Create a gcp_Cloud_Data_Catalog dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Data_Catalog(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Data_Catalog");
}

/**
 * Create a gcp_Cloud_Data_Fusion dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Data_Fusion(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Data_Fusion");
}

/**
 * Create a gcp_Cloud_Dataflow dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Dataflow(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Dataflow");
}

/**
 * Create a gcp_Cloud_Datalab dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Datalab(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Datalab");
}

/**
 * Create a gcp_Cloud_Dataprep dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Dataprep(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Dataprep");
}

/**
 * Create a gcp_Cloud_Dataproc dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Dataproc(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Dataproc");
}

/**
 * Create a gcp_Cloud_PubSub dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_PubSub(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_PubSub");
}

/**
 * Create a gcp_Genomics dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Genomics(...elts) {
  return terminal(...elts)._subType_("gcp_Genomics");
}

/**
 * Create a gcp_App_Engine dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_App_Engine(...elts) {
  return terminal(...elts)._subType_("gcp_App_Engine");
}

/**
 * Create a gcp_Cloud_Functions dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Functions(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Functions");
}

/**
 * Create a gcp_Cloud_Run dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Run(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Run");
}

/**
 * Create a gcp_Compute_Engine dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Compute_Engine(...elts) {
  return terminal(...elts)._subType_("gcp_Compute_Engine");
}

/**
 * Create a gcp_Container_Optimized_OS dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Container_Optimized_OS(...elts) {
  return terminal(...elts)._subType_("gcp_Container_Optimized_OS");
}

/**
 * Create a gcp_GKE_On_Prem dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_GKE_On_Prem(...elts) {
  return terminal(...elts)._subType_("gcp_GKE_On_Prem");
}

/**
 * Create a gcp_GPU dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_GPU(...elts) {
  return terminal(...elts)._subType_("gcp_GPU");
}

/**
 * Create a gcp_Kubetnetes_Engine dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Kubetnetes_Engine(...elts) {
  return terminal(...elts)._subType_("gcp_Kubetnetes_Engine");
}

/**
 * Create a gcp_API_Analytics dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_API_Analytics(...elts) {
  return terminal(...elts)._subType_("gcp_API_Analytics");
}

/**
 * Create a gcp_API_Monetization dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_API_Monetization(...elts) {
  return terminal(...elts)._subType_("gcp_API_Monetization");
}

/**
 * Create a gcp_Apigee_API_Platform dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Apigee_API_Platform(...elts) {
  return terminal(...elts)._subType_("gcp_Apigee_API_Platform");
}

/**
 * Create a gcp_Apigee_Sense dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Apigee_Sense(...elts) {
  return terminal(...elts)._subType_("gcp_Apigee_Sense");
}

/**
 * Create a gcp_Cloud_Endpoints dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Endpoints(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Endpoints");
}

/**
 * Create a gcp_Developer_Portal dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Developer_Portal(...elts) {
  return terminal(...elts)._subType_("gcp_Developer_Portal");
}

/**
 * Create a gcp_Advanced_Solutions_Lab dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Advanced_Solutions_Lab(...elts) {
  return terminal(...elts)._subType_("gcp_Advanced_Solutions_Lab");
}

/**
 * Create a gcp_AI_Hub dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_AI_Hub(...elts) {
  return terminal(...elts)._subType_("gcp_AI_Hub");
}

/**
 * Create a gcp_AI_Platform_Data_Labeling_Service dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_AI_Platform_Data_Labeling_Service(...elts) {
  return terminal(...elts)._subType_("gcp_AI_Platform_Data_Labeling_Service");
}

/**
 * Create a gcp_AI_Platform dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_AI_Platform(...elts) {
  return terminal(...elts)._subType_("gcp_AI_Platform");
}

/**
 * Create a gcp_AutoML_Natural_Language dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_AutoML_Natural_Language(...elts) {
  return terminal(...elts)._subType_("gcp_AutoML_Natural_Language");
}

/**
 * Create a gcp_AutoML_Tables dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_AutoML_Tables(...elts) {
  return terminal(...elts)._subType_("gcp_AutoML_Tables");
}

/**
 * Create a gcp_AutoML_Translation dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_AutoML_Translation(...elts) {
  return terminal(...elts)._subType_("gcp_AutoML_Translation");
}

/**
 * Create a gcp_AutoML_Video_Intelligence dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_AutoML_Video_Intelligence(...elts) {
  return terminal(...elts)._subType_("gcp_AutoML_Video_Intelligence");
}

/**
 * Create a gcp_AutoML_Vision dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_AutoML_Vision(...elts) {
  return terminal(...elts)._subType_("gcp_AutoML_Vision");
}

/**
 * Create a gcp_Cloud_AutoML dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_AutoML(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_AutoML");
}

/**
 * Create a gcp_Cloud_Inference_API dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Inference_API(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Inference_API");
}

/**
 * Create a gcp_Cloud_Jobs_API dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Jobs_API(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Jobs_API");
}

/**
 * Create a gcp_Cloud_Natural_Language_API dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Natural_Language_API(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Natural_Language_API");
}

/**
 * Create a gcp_Cloud_Speech_to_Text dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Speech_to_Text(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Speech_to_Text");
}

/**
 * Create a gcp_Cloud_Text_to_Speech dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Text_to_Speech(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Text_to_Speech");
}

/**
 * Create a gcp_Cloud_TPU dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_TPU(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_TPU");
}

/**
 * Create a gcp_Cloud_Translation_API dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Translation_API(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Translation_API");
}

/**
 * Create a gcp_Cloud_Video_Intelligence_API dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Video_Intelligence_API(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Video_Intelligence_API");
}

/**
 * Create a gcp_Cloud_Vision_API dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Cloud_Vision_API(...elts) {
  return terminal(...elts)._subType_("gcp_Cloud_Vision_API");
}

/**
 * Create a gcp_Dialog_Flow_Enterprise_Edition dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Dialog_Flow_Enterprise_Edition(...elts) {
  return terminal(...elts)._subType_("gcp_Dialog_Flow_Enterprise_Edition");
}

/**
 * Create a gcp_Recommendations_AI dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} dsl object.
 */
export function gcp_Recommendations_AI(...elts) {
  return terminal(...elts)._subType_("gcp_Recommendations_AI");
}

