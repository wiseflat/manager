import {
  CLOUD_PROJECT_STATE,
  CLOUD_PROJECT_BILLING_STATE,
} from '../../../../constants';

export default class ProjectListController {
  /* @ngInject */
  constructor(
    $injector,
    $q,
    $state,
    $translate,
    OvhApiCloudProjectServiceInfos,
    publicCloud,
    iceberg,
  ) {
    this.$injector = $injector;
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.OvhApiCloudProjectServiceInfos = OvhApiCloudProjectServiceInfos;
    this.publicCloud = publicCloud;
    this.iceberg = iceberg;
  }

  $onInit() {
    this.getProjects();
    this.getTranslations();
  }

  getTranslations() {
    this.isLoadingTranslations = true;

    return this.$injector
      .invoke(/* @ngTranslationsInject:json ./translations */)
      .then(() => this.$translate.refresh())
      .finally(() => {
        this.isLoadingTranslations = false;
      });
  }

  getProjects() {
    this.isLoading = true;
    this.publicCloud
      .getProjects([
        {
          field: 'status',
          comparator: 'in',
          reference: [
            CLOUD_PROJECT_STATE.creating,
            CLOUD_PROJECT_STATE.ok,
            CLOUD_PROJECT_STATE.suspended,
          ],
        },
      ])
      .then((projects) => {
        this.projects = projects;
      })
      .catch((err) => {
        this.err = err;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  goToProjectDetails(project) {
    return this.OvhApiCloudProjectServiceInfos.v6()
      .get({ serviceName: project.project_id })
      .$promise.then((serviceInfo) =>
        project.status === CLOUD_PROJECT_STATE.suspended ||
        serviceInfo.status === CLOUD_PROJECT_BILLING_STATE.PENDING_DEBT
          ? this.$state.go('pci.projects.project.inactive', {
              billingStatus: serviceInfo.status,
              projectId: project.project_id,
              projectStatus: project.status,
            })
          : this.$state.go('pci.projects.project', {
              projectId: project.project_id,
            }),
      );
  }
}
