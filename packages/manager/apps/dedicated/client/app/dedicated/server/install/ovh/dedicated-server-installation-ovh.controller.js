import chunk from 'lodash/chunk';
import camelCase from 'lodash/camelCase';
import compact from 'lodash/compact';
import find from 'lodash/find';
import findLastIndex from 'lodash/findLastIndex';
import forEachRight from 'lodash/forEachRight';
import get from 'lodash/get';
import head from 'lodash/head';
import includes from 'lodash/includes';
import map from 'lodash/map';
import range from 'lodash/range';
import set from 'lodash/set';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';

import {
  FORBIDDEN_MOUNT_POINT,
  SIZE,
  SWAP_LABEL,
  TEMPLATE_OS_HARDWARE_RAID_ENUM,
  UNITS,
  WARNING,
} from './dedicated-server-installation-ovh.constant';

export default class {
  /* @ngInject */
  constructor(
    $filter,
    $q,
    $rootScope,
    $scope,
    $stateParams,
    $translate,
    Alerter,
    Server,
  ) {
    this.$filter = $filter;
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Server = Server;
    this.SIZE = SIZE;
    this.WARNING = WARNING;
  }

  $onInit() {
    this.countFilter = [];

    this.data = {
      server: angular.copy(this.server),
      // get by this.Server.getOvhPartitionSchemesTemplates
      raidList: null, // Map[nbDisk, available raid]
      fileSystemList: null,
      partitionTypeList: null,
    };

    this.installation = {
      hasData: false, // false if no distribution is available
      // STEP1
      desktopType: [],
      familyType: [],
      distributionList: null,
      // warningExistPartition: true if a partition has personnalisation
      // in progress(use if user back in distriction list)
      warningExistPartition: false,

      // STEP1 SELECT
      selectDesktopType: null,
      selectFamily: null,
      selectDistribution: null,
      // saveSelectDistribution : save new distribution if a partition
      // has personnalisation in progress(see setSelectDistribution())
      saveSelectDistribution: null,
      selectLanguage: null,
      diskGroup: null,
      customInstall: false, // load personnalisation partition screen
      // STEP HARD RAID
      hardwareRaid: {
        controller: null, // RAID controller
        disks: null, // Number of disk on which the RAID will be affected
        raid: null, // The type of RAID
        arrays: null, // Number of array (french: grappe)
        totalSpace: null,
        availableSpace: null,
        error: null,
      },

      // STEP2
      partitionSchemesList: null, // list of available partitions scheme
      // STEP2 SELECT
      selectPartitionScheme: null, // select hight priority partition scheme
      partitionSchemeModels: null, // detail of partitionScheme selected
      nbDiskUse: null, // if nbPhysicalDisk > 2 user can select nb disk to use
      // dirtyPartition: true if variable partition size
      // has been customized(change to false in loadPartiton())
      dirtyPartition: true,
      // STEP3
      gabaritNameSave: null,
      options: {
        saveGabarit: false,
        gabaritNameSave: null,
        changeLog: null,
        customHostname: null,
        postInstallationScriptLink: null,
        postInstallationScriptReturn: null,
        sshKeyName: null,
        useDistributionKernel: false,
        installSqlServer: false,
        useSpla: false,
        variablePartition: null,
        validForm: true,
      },
      variablePartition: false,
      saveSize: null,
    };

    this.informations = {
      totalSize: 0,
      diskSize: 0,
      // nbDisk: Nb of disk use for partitionning.
      // If server has Raid controller, nbDisk = 1, nbPhysicalDisk = n
      nbDisk: 0,
      nbPhysicalDisk: 0, // Nb physical Disk
      typeDisk: null,
      otherDisk: [],
      gabaritName: null,
      isCachecade: false,
      raidController: false,
      hardwareRaid: {
        profile: null, // Profile information of hardware Raid
        availableRaids: [],
        error: {},
        availableDisks: [],
        availableArrays: [],
      },
      remainingSize: 0,
      showAllDisk: false,
      diskGroups: [],
    };

    this.newPartition = {
      order: 0,
      typePartition: null,
      fileSystem: null,
      mountPoint: null,
      volumeName: null,
      raid: null,
      partitionSize: 0,
      canBeDelete: true,
      display: false,
      hasWarning: false,
      realSize: 0,
      progressColor: null,
    };

    this.setPartition = {
      save: null,
      delModel: null,
      indexSet: -1,
    };

    this.buttonControl = {
      displayAddConfirmation: false,
      deleteInProgress: false,
      setInProgress: false,
      addInProgress: false,
    };

    this.loader = {
      loading: false,
      loadingForm: false,
      loadingCapabilities: false,
    };

    this.errorInst = {
      order: false,
      orderFirst: false,
      orderFirstWin: false,
      fileSystemSwap: false,
      fileSystemNoSwap: false,
      raid0: false,
      raidLv: false,
      orderType: false,
      typeLogicalLv: false,
      typePrimary: false,
      typeLvSwap: false,

      mountPointEmpty: false,
      mountPoint: false,
      mountPoint2: false,
      mountPointUse: false,

      volumeNameEmpty: false,
      volumeName: false,
      volumeNameUse: false,

      partitionSizeToAdd: false,
      partitionSizeOver: false,
      partitionSizeSwap: false,
      partitionSize: false,
      partitionSizeMin: false,
      partitionSizeWindows: false,
      partitionSizeReiserfs: false,
      partitionSizeBoot: false,

      ws: false,
      wsinstall: false,
      gabaritName: false,
    };

    this.configError = {
      raidDiskUse: false,
    };

    this.warning = {
      raid0: false,
    };

    this.validation = {
      orderList: [],
      mountPointList: [],
      volumeNameList: [],
      hasSwap: false,
      maxOrder: 0,
    };

    this.bar = {
      progress: [],
      total: 0,
    };

    this.sshList = [];

    // If the diskGroup is not the first disk group, we need to disable raid setup if it is enabled.
    this.$scope.$watch('installation.diskGroup', (newValue) => {
      if (newValue) {
        if (
          newValue.diskGroupId !==
          get(this.informations.diskGroups[0] || {}, 'diskGroupId')
        ) {
          this.installation.raidSetup = false;
        }
        this.refreshDiskGroupInfos(newValue);
      }
    });

    this.$scope.$watch('installation.nbDiskUse', (newValue) => {
      if (this.installation.partitionSchemeModels) {
        this.validationNbDiskUse(newValue);
      }
    });

    this.$scope.$watch('installation.partitionSchemeModels', () => {
      this.refreshBar();
    });

    // ------ HARDWARE RAID TOOL--------
    this.$scope.$watch('installation.hardwareRaid.controller', () => {
      this.clearHardwareRaidSpace();
      this.recalculateAvailableRaid();
    });

    this.$scope.$watch('installation.hardwareRaid.raid', () => {
      this.clearHardwareRaidSpace();
      this.recalculateAvailableRaidDisks();
    });

    this.$scope.$watch('installation.hardwareRaid.disks', () => {
      this.clearHardwareRaidSpace();
      this.recalculateAvailableArrays();
    });

    this.$scope.$watch('installation.hardwareRaid.arrays', () => {
      this.recalculateSpace();
      if (
        this.installation.hardwareRaid.disks &&
        this.installation.hardwareRaid.arrays
      ) {
        this.installation.hardwareRaid.error = this.invalidHardRaid();
      }
    });

    this.$scope.$on(
      'dedicated.informations.reinstall.form.update',
      (e, validForm) => {
        this.installation.options.validForm = validForm;
      },
    );
  }

  // ------STEP1------
  load() {
    this.loader.loading = true;

    const getHardRaid = this.getHardwareRaid();
    const getOvhTemplates = this.Server.getOvhTemplates(
      this.$stateParams.productId,
    )
      .then((templateList) => {
        this.installation.desktopType = templateList.category;
        this.installation.familyType = templateList.family;
        this.installation.distributionList = templateList.templates.results;
        this.installation.selectDesktopType = head(
          this.installation.desktopType,
        );
        this.installation.selectFamily = this.WARNING.WARNING_LINUX;
      })
      .catch((data) => {
        this.$scope.resetAction();
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'server_configuration_installation_ovh_fail_os',
            { t0: this.data.server.name },
          ),
          data.data,
          'server_dashboard_alert',
        );
      });
    const getSshKeys = this.Server.getSshKey(this.$stateParams.productId).then(
      (data) => {
        this.sshList = data;
      },
    );

    this.$q.all([getHardRaid, getOvhTemplates, getSshKeys]).finally(() => {
      this.loader.loading = false;
    });
  }

  getCountFilter(itemFamily) {
    const tab = this.$filter('filter')(this.installation.distributionList, {
      family: itemFamily,
      category: this.installation.selectDesktopType,
    });
    this.countFilter[itemFamily] = tab.length;
    if (this.countFilter[itemFamily] > 0) {
      this.installation.hasData = true;
    }

    return tab;
  }

  resetDiskGroup() {
    this.installation.diskGroup = head(this.informations.diskGroups);
  }

  getHardwareSpecification() {
    return this.Server.getHardwareSpecifications(
      this.$stateParams.productId,
    ).then((spec) => {
      this.informations.diskGroups = spec.diskGroups;
      this.resetDiskGroup();
    });
  }

  setSelectDistribution(distribution, bypass) {
    // if saveSelectDistribution is not null, a partition has personnalisation
    // in progress and confirmation to delete is already display
    if (this.installation.saveSelectDistribution && !bypass) {
      this.installation.saveSelectDistribution = distribution;
    } else if (
      !this.installation.saveSelectDistribution &&
      this.installation.partitionSchemeModels
    ) {
      // a partition has personnalisation in progress beacause partitionSchemeModels is not null
      this.installation.warningExistPartition = true; // confirmation to delete display
      this.installation.saveSelectDistribution = distribution; // save new (futur?) distribution
    } else {
      // No partition is currently in personnalisation or confirmation
      // to delete currently partitions(bypass = true)
      this.installation.warningExistPartition = false;
      this.installation.partitionSchemeModels = null;

      this.installation.isHybridCompatible = false;
      this.installation.selectDistribution = distribution;

      if (distribution) {
        this.loader.loadingCapabilities = true;
        this.Server.getTemplateCapabilities(
          this.$stateParams.productId,
          distribution.id,
        )
          .then((data) => {
            this.installation.isHybridCompatible = data.hybridSupport;
            if (!this.installation.isHybridCompatible) {
              this.resetDiskGroup();
            }
          })
          .finally(() => {
            this.loader.loadingCapabilities = false;
          });

        this.installation.selectLanguage = this.installation.selectDistribution.defaultLanguage;
      } else {
        this.resetDiskGroup();
      }

      this.installation.saveSelectDistribution = null;
      this.informations.gabaritName = null;
    }

    if (
      this.installation.selectDistribution &&
      this.installation.selectDistribution.hardRaidConfiguration === false
    ) {
      this.installation.raidSetup = false;
    }
  }

  cancelSetSelectDistribution() {
    this.installation.warningExistPartition = false;
    this.installation.saveSelectDistribution = null;
  }

  // ------STEP Hard Raid------

  getHardwareRaidProfile() {
    return this.Server.getHardwareRaidProfile(this.$stateParams.productId).then(
      (raidProfile) => {
        this.informations.hardwareRaid.profile = raidProfile;
        if (some(get(raidProfile, 'controllers'))) {
          this.installation.hardwareRaid.controller = head(
            raidProfile.controllers,
          );
        }
      },
    );
  }

  getHardwareRaid() {
    if (!this.informations.hardwareRaid.profile) {
      this.loader.loading = true;
      return this.$q
        .all([this.getHardwareRaidProfile(), this.getHardwareSpecification()])
        .catch((error) => {
          this.informations.hardwareRaid.error.wrongLocation = this.Server.isHardRaidLocationError(
            error,
          );
          this.informations.hardwareRaid.error.notAvailable = this.Server.isHardRaidUnavailableError(
            error,
          );
          if (
            !this.informations.hardwareRaid.error.wrongLocation &&
            !this.informations.hardwareRaid.error.notAvailable
          ) {
            this.$scope.resetAction();
            this.Alerter.alertFromSWS(
              this.$translate.instant(
                'server_configuration_installation_ovh_stephardraid_loading_error',
              ),
              error.data,
              'server_dashboard_alert',
            );
          }
        });
    }
    return this.$q.when({});
  }

  // Delete all Error message after cancel action
  clearError() {
    angular.forEach(this.warning, (value, key) => {
      this.warning[key] = false;
    });
    angular.forEach(this.errorInst, (value, key) => {
      this.errorInst[key] = false;
    });
  }

  // get real use size for partition with 0 in size (in fact remaining size)
  getRealRemainingSize(raid) {
    const remainingSize = this.getRemainingSize();
    let realRemainingSize = 0;

    if (!Number.isNaN(remainingSize)) {
      if (
        this.installation.nbDiskUse === 1 ||
        this.informations.raidController
      ) {
        realRemainingSize = remainingSize;
      } else if (raid) {
        switch (raid) {
          case '_0':
            realRemainingSize = remainingSize;
            break;
          case '_1':
            realRemainingSize = remainingSize / this.installation.nbDiskUse;
            break;
          case '_5':
            realRemainingSize =
              remainingSize - remainingSize / this.installation.nbDiskUse;
            break;
          case '_6':
            realRemainingSize =
              remainingSize - (remainingSize / this.installation.nbDiskUse) * 2;
            break;
          case '_10':
            realRemainingSize =
              remainingSize / (this.installation.nbDiskUse / 2);
            break;
          default:
            break;
        }
      }
    }

    if (
      !this.installation.selectDistribution.supportsGpt &&
      realRemainingSize > this.SIZE.MAX_SIZE_PARTITION
    ) {
      return this.SIZE.MAX_SIZE_PARTITION;
    }

    return realRemainingSize;
  }

  showPartition() {
    // Select hight priority partition scheme
    this.installation.selectPartitionScheme = this.installation.partitionSchemesList[
      this.installation.partitionSchemesList.length - 1
    ];

    // Get Partition list of largest partition scheme
    this.Server.getOvhPartitionSchemesTemplatesDetail(
      this.informations.gabaritName,
      this.installation.selectPartitionScheme.name,
    ).then(
      (partitionSchemeModels) => {
        this.loader.loading = false;
        this.installation.partitionSchemeModels = partitionSchemeModels.results;

        // get total use size (remainingSize),
        // assign random color
        // rename order by orderTable
        angular.forEach(
          this.installation.partitionSchemeModels,
          (partition, _index) => {
            set(
              partition,
              'progressColor',
              this.constructor.getRandomColor(_index),
            );
            set(partition, 'orderTable', angular.copy(partition.order));
          },
        );

        // if one partition has size = 0 => replace by remaining size
        let hasEmptyPartitionSize = false;

        forEachRight(
          partitionSchemeModels.results,
          (partitionSchemeModel, partitionIndex) => {
            if (!hasEmptyPartitionSize) {
              set(
                this.installation.partitionSchemeModels[partitionIndex],
                'hasWarning',
                false,
              );

              if (
                get(
                  this.installation.partitionSchemeModels[partitionIndex],
                  'partitionSize',
                ) === 0
              ) {
                set(
                  this.installation.partitionSchemeModels[partitionIndex],
                  'partitionSize',
                  this.getRealRemainingSize(
                    this.installation.partitionSchemeModels[partitionIndex]
                      .raid,
                  ),
                );

                // To save information if user change nb disque
                // installation and personnalisation is not dirty
                set(
                  partitionSchemeModels[partitionIndex],
                  'isRemainingSizePartition',
                  true,
                );
                this.installation.dirtyPartition = false;
                hasEmptyPartitionSize = true;
              }
            }
          },
        );

        // for refresh progress bar
        this.getRemainingSize();
      },
      (data) => {
        this.loader.loading = false;
        this.$scope.resetAction();
        set(data, 'type', 'ERROR');
        this.$scope.setMessage(
          this.$translate.instant(
            'server_configuration_installation_ovh_fail_partition_schemes',
            { t0: this.data.server.name },
          ),
          data.data,
        );
      },
    );
  }

  // ------STEP2------
  loadPartiton() {
    if (
      !this.installation.partitionSchemeModels ||
      this.informations.totalSize !==
        this.installation.hardwareRaid.availableSpace
    ) {
      this.loader.loading = true;

      // init
      this.newPartition.display = false;
      this.setPartition.save = null;
      this.setPartition.indexSet = -1;
      this.setPartition.delModel = null;
      this.clearError();

      this.Server.getOvhPartitionSchemesTemplates(
        this.$stateParams.productId,
        this.installation.selectDistribution.id,
        this.installation.selectLanguage,
        this.informations.customInstall,
      ).then(
        (partitionSchemesList) => {
          this.installation.partitionSchemesList = partitionSchemesList.results;

          this.informations.gabaritName = partitionSchemesList.gabaritName;
          this.data.raidList = partitionSchemesList.partitionRaidEnumMap;
          this.data.fileSystemList =
            partitionSchemesList.templateOsFileSystemEnum;
          this.data.partitionTypeList =
            partitionSchemesList.templatePartitionTypeEnum;

          // if hardware Raid
          if (this.installation.hardwareRaid.raid) {
            const newPartitioningScheme = {
              name: `hardwareRaid-${this.installation.hardwareRaid.raid}`,
              priority: 50,
            };
            return this.Server.createPartitioningScheme(
              this.$stateParams.productId,
              this.informations.gabaritName,
              newPartitioningScheme,
            )
              .then(() =>
                this.Server.cloneDefaultPartitioningScheme(
                  this.$stateParams.productId,
                  this.informations.gabaritName,
                  `hardwareRaid-${this.installation.hardwareRaid.raid}`,
                ),
              )
              .then(() => {
                this.installation.partitionSchemesList.push(
                  newPartitioningScheme,
                );
                this.installation.partitionSchemesList = sortBy(
                  this.installation.partitionSchemesList,
                  'priority',
                );
                this.showPartition();
              })
              .catch((error) => {
                this.loader.loading = false;
                this.$scope.resetAction();
                this.Alerter.alertFromSWS(
                  this.$translate.instant(
                    'server_configuration_installation_ovh_stephardraid_loading_error',
                  ),
                  error,
                  'server_dashboard_alert',
                );
              });
          }
          this.installation.partitionSchemesList = sortBy(
            this.installation.partitionSchemesList,
            'priority',
          );
          if (this.installation.partitionSchemesList.length > 0) {
            this.showPartition();
          }
          return null;
        },
        (data) => {
          this.loader.loading = false;
          this.$scope.resetAction();
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'server_configuration_installation_ovh_fail_partition_schemes',
              { t0: this.data.server.name },
            ),
            data.data,
            'server_dashboard_alert',
          );
        },
      );
    }
  }

  static toBytes(size) {
    let multiplicator = 1;
    switch (size.unit) {
      case 'KB':
        multiplicator = 1024;
        break;
      case 'MB':
        // eslint-disable-next-line no-restricted-properties
        multiplicator = Math.pow(1024, 2);
        break;
      case 'GB':
        // eslint-disable-next-line no-restricted-properties
        multiplicator = Math.pow(1024, 3);
        break;
      case 'TB':
        // eslint-disable-next-line no-restricted-properties
        multiplicator = Math.pow(1024, 4);
        break;
      case 'PB':
        // eslint-disable-next-line no-restricted-properties
        multiplicator = Math.pow(1024, 5);
        break;
      case 'EB':
        // eslint-disable-next-line no-restricted-properties
        multiplicator = Math.pow(1024, 6);
        break;
      case 'YB':
        // eslint-disable-next-line no-restricted-properties
        multiplicator = Math.pow(1024, 7);
        break;
      default:
        break;
    }
    return size.value * multiplicator;
  }

  refreshDiskGroupInfos(newDiskGroup) {
    this.informations.isCachecade = newDiskGroup.raidController === 'cache';
    this.informations.raidController = newDiskGroup.raidController !== null;
    this.informations.typeDisk = newDiskGroup.diskType;
    this.informations.nbPhysicalDisk = newDiskGroup.numberOfDisks;
    this.informations.diskSize = Math.round(
      this.constructor.toBytes(newDiskGroup.diskSize) / 1000 / 1000,
    );
    this.informations.nbDisk =
      newDiskGroup.raidController !== null ? 1 : newDiskGroup.numberOfDisks;
    this.installation.nbDiskUse = this.informations.nbDisk;

    if (this.installation.hardwareRaid.availableSpace) {
      this.informations.totalSize = this.installation.hardwareRaid.availableSpace;
    } else {
      this.informations.totalSize =
        newDiskGroup.raidController !== null
          ? Math.round(
              this.constructor.toBytes(newDiskGroup.diskSize) / 1000 / 1000,
            )
          : Math.round(
              this.constructor.toBytes(newDiskGroup.diskSize) / 1000 / 1000,
            ) * get(newDiskGroup, 'numberOfDisks', 0);
    }

    const otherDisk = find(
      this.informations.diskGroups,
      (diskGroup) => diskGroup.diskGroupId !== newDiskGroup.diskGroupId,
    );
    this.informations.otherDisk = map(compact([otherDisk]), (disk) => ({
      typeDisk: disk.diskType,
      nbDisk: disk.numberOfDisks,
      sizeDisk: Math.round(
        this.constructor.toBytes(disk.diskSize) / 1000 / 1000,
      ),
    }));
  }

  validationNbDiskUse(nbDisk) {
    let indexVarPartition = null;
    const raidList = this.getRaidList(nbDisk);

    this.configError.raidDiskUse = false;

    if (nbDisk !== 1) {
      forEachRight(
        this.installation.partitionSchemeModels,
        (partitionSchemeModel, partitionSchemeModelIndex) => {
          if (
            !this.installation.dirtyPartition &&
            indexVarPartition === null &&
            partitionSchemeModel &&
            partitionSchemeModel.isRemainingSizePartition
          ) {
            indexVarPartition = partitionSchemeModelIndex;
          }

          if (
            this.informations.nbDisk > 2 &&
            !includes(raidList, partitionSchemeModel.raid)
          ) {
            this.configError.raidDiskUse = true;
            set(partitionSchemeModel, 'hasWarning', true);
          } else {
            set(partitionSchemeModel, 'hasWarning', false);
          }
        },
      );
    }

    if (!this.installation.hardwareRaid.raid) {
      this.informations.totalSize =
        this.informations.diskSize * this.installation.nbDiskUse;
    }

    if (!this.configError.raidDiskUse && indexVarPartition !== null) {
      this.installation.partitionSchemeModels[
        indexVarPartition
      ].partitionSize = 0;
      this.installation.partitionSchemeModels[
        indexVarPartition
      ].partitionSize = this.getRealRemainingSize(
        this.installation.partitionSchemeModels[indexVarPartition].raid,
      );
    }

    this.getRemainingSize();
  }

  validationTypePrimary(forNewPartition) {
    let nbPrimary = 0;
    let nbOther = 0;

    angular.forEach(this.installation.partitionSchemeModels, (partition2) => {
      if (partition2.typePartition === this.WARNING.WARNING_PRIMARY) {
        nbPrimary += 1;
      } else {
        nbOther += 1;
      }
    });
    if (forNewPartition) {
      return nbPrimary === 4;
    }
    return (nbPrimary === 4 && nbOther > 0) || nbPrimary > 4;
  }

  // ------VALIDATION TOOLS------
  // Create table of boolean with key = the propertie and value = true
  // because this propertie is already use
  updateNoAllowProperties(excludedPartition) {
    this.validation.orderList = [];
    this.validation.mountPointList = [];
    this.validation.volumeNameList = [];
    this.validation.hasSwap = false;
    this.validation.maxOrder = 0;
    angular.forEach(this.installation.partitionSchemeModels, (partition) => {
      if (this.validation.maxOrder < partition.order) {
        this.validation.maxOrder = partition.order;
      }
      if (!excludedPartition || excludedPartition.order !== partition.order) {
        this.validation.orderList[partition.order] = true;
      }
      if (
        !excludedPartition ||
        excludedPartition.mountPoint !== partition.mountPoint
      ) {
        this.validation.mountPointList[
          partition.mountPoint.toLowerCase()
        ] = true;
      }
      if (
        partition.volumeName &&
        (!excludedPartition ||
          excludedPartition.volumeName !== partition.volumeName)
      ) {
        this.validation.volumeNameList[
          partition.volumeName.toLowerCase()
        ] = true;
      }
      if (
        partition.fileSystem === this.WARNING.WARNING_SWAP &&
        (!excludedPartition ||
          excludedPartition.fileSystem !== this.WARNING.WARNING_SWAP)
      ) {
        this.validation.hasSwap = true;
      }
    });
  }

  // ------END VALIDATION TOOLS------

  // ------Add partition------

  displayNewPartition() {
    const raidList = this.getRaidList(this.installation.nbDiskUse);
    this.clearError();
    this.newPartition.raid =
      (raidList.length > 0 && raidList[raidList.length - 1]) ||
      this.WARNING.WARNING_RAID1;
    this.newPartition.partitionSize = this.getRealRemainingSize(
      this.newPartition.raid,
    );

    if (includes(this.data.partitionTypeList, this.WARNING.WARNING_LOGICAL)) {
      this.newPartition.typePartition = angular.copy(
        this.WARNING.WARNING_LOGICAL,
      );
    } else {
      this.newPartition.typePartition = angular.copy(
        this.data.partitionTypeList[0],
      );
    }
    if (
      this.installation.selectDistribution.family ===
      this.WARNING.WARNING_WINDOWS
    ) {
      if (includes(this.data.fileSystemList, this.WARNING.WARNING_NTFS)) {
        this.newPartition.fileSystem = angular.copy(this.WARNING.WARNING_NTFS);
      } else {
        this.newPartition.fileSystem = angular.copy(
          this.data.fileSystemList[0],
        );
      }
    } else if (includes(this.data.fileSystemList, this.WARNING.WARNING_EXT4)) {
      this.newPartition.fileSystem = angular.copy(this.WARNING.WARNING_EXT4);
    } else {
      this.newPartition.fileSystem = angular.copy(this.data.fileSystemList[0]);
    }

    this.newPartition.progressColor = this.constructor.getRandomColor();
    if (this.validationTypePrimary(true)) {
      this.errorInst.typePrimary = true;
    } else if (
      this.installation.selectDistribution.family ===
        this.WARNING.WARNING_WINDOWS &&
      this.newPartition.partitionSize < this.SIZE.MIN_SIZE_WINDOWS
    ) {
      this.errorInst.partitionSizeWindows = true;
    } else if (this.newPartition.partitionSize < this.SIZE.MIN_SIZE_PARTITION) {
      this.errorInst.partitionSizeToAdd = true;
    } else {
      this.newPartition.display = true;
    }
    this.updateNoAllowProperties();
    this.newPartition.order = this.validation.maxOrder + 1;
    this.getRemainingSize();
  }

  checkall(partition) {
    this.validationMountPoint(partition);
    this.validationVolumeName(partition);
    this.validationFileSystem(partition);
  }

  isValidPartition() {
    return (
      !this.$scope.hasErrorOrder() &&
      !this.hasErrorType() &&
      !this.hasErrorFileSystem() &&
      !this.hasErrorMountPoint() &&
      !this.hasErrorVolumeName() &&
      !this.hasErrorRaid() &&
      !this.hasErrorSize()
    );
  }

  validAddPartition(bypassRaid) {
    let trueSize = 0;
    this.buttonControl.addInProgress = true;
    this.checkall(this.newPartition);
    if (this.isValidPartition()) {
      if (!bypassRaid && this.warning.raid0) {
        this.buttonControl.displayAddConfirmation = true;
        this.buttonControl.addInProgress = false;
      } else {
        trueSize = this.newPartition.partitionSize;
        if (this.newPartition.typePartition !== this.WARNING.WARNING_LV) {
          this.newPartition.volumeName = null;
        }

        if (
          this.informations.raidController ||
          this.informations.nbDisk === 1
        ) {
          this.newPartition.raid = null;
        }

        this.Server.postAddPartition(
          this.informations.gabaritName,
          this.installation.selectPartitionScheme.name,
          {
            raid: this.newPartition.raid,
            fileSystem: this.newPartition.fileSystem,
            typePartition: this.newPartition.typePartition,
            volumeName: this.newPartition.volumeName,
            order: this.newPartition.order,
            mountPoint: this.newPartition.mountPoint,
            oldMountPoint: this.newPartition.mountPoint,
            partitionSize: trueSize,
          },
        ).then(
          () => {
            this.warning.raid0 = false;
            this.newPartition.partitionSize = trueSize;
            this.newPartition.orderTable = angular.copy(
              this.newPartition.order,
            );
            this.installation.partitionSchemeModels.push(
              angular.copy(this.newPartition),
            );

            this.newPartition.order = null;
            this.newPartition.typePartition = null;
            this.newPartition.fileSystem = null;
            this.newPartition.mountPoint = null;
            this.newPartition.volumeName = null;
            this.newPartition.raid = null;
            this.newPartition.partitionSize = null;

            this.newPartition.display = false;

            this.buttonControl.displayAddConfirmation = false;
            this.buttonControl.addInProgress = false;
            this.clearError();
            this.refreshBar();
            this.validationNbDiskUse(this.installation.nbDiskUse);
          },
          (data) => {
            this.buttonControl.addInProgress = false;
            this.errorInst.ws = this.$translate.instant(
              'server_configuration_installation_ovh_step2_error_add',
              {
                t0: this.newPartition.mountPoint,
                t1: data.data.message,
              },
            );
          },
        );
      }
    } else {
      this.buttonControl.addInProgress = false;
    }
    this.getRemainingSize();
  }

  cancelAddPartition() {
    this.newPartition.display = false;
    this.getRemainingSize();
    this.clearError();
  }

  // ------Set partition------

  // Get index in partitionSchemeModels table where partition is located
  getIndexOfPartition(partition) {
    return findLastIndex(
      this.installation.partitionSchemeModels,
      (partitionSchemeModel) =>
        get(partitionSchemeModel, 'order') === partition.order,
    );
  }

  displaySetPartition(partition) {
    // Use index for save what partition is changed
    const index = this.getIndexOfPartition(partition);
    this.clearError();
    this.setPartition.indexSet = index;
    this.setPartition.save = angular.copy(
      this.installation.partitionSchemeModels[index],
    );
    this.updateNoAllowProperties(partition);
    this.getRemainingSize();
  }

  validSetPartition(bypassRaid) {
    const partitionToSet = this.installation.partitionSchemeModels[
      this.setPartition.indexSet
    ];
    let trueSize = 0;
    this.buttonControl.setInProgress = true;
    this.checkall(partitionToSet);
    if (this.isValidPartition()) {
      if (!bypassRaid && this.warning.raid0) {
        this.buttonControl.displayAddConfirmation = true;
        this.buttonControl.setInProgress = false;
      } else {
        trueSize = partitionToSet.partitionSize;
        if (partitionToSet.typePartition !== this.WARNING.WARNING_LV) {
          partitionToSet.volumeName = null;
        }

        this.Server.putSetPartition(
          this.informations.gabaritName,
          this.installation.selectPartitionScheme.name,
          {
            raid: partitionToSet.raid,
            fileSystem: partitionToSet.fileSystem,
            typePartition: partitionToSet.typePartition,
            volumeName: partitionToSet.volumeName,
            order: partitionToSet.order,
            mountPoint: partitionToSet.mountPoint,
            oldMountPoint: this.setPartition.save.mountPoint,
            partitionSize: trueSize,
          },
        ).then(
          () => {
            if (partitionToSet.isRemainingSizePartition) {
              this.installation.dirtyPartition = true;
            }
            this.warning.raid0 = false;

            partitionToSet.partitionSize = trueSize;
            partitionToSet.orderTable = angular.copy(partitionToSet.order);

            this.setPartition.save = null;
            this.setPartition.indexSet = -1;

            this.buttonControl.displayAddConfirmation = false;
            this.buttonControl.setInProgress = false;
            this.clearError();
            this.validationNbDiskUse(this.installation.nbDiskUse);
          },
          (data) => {
            this.buttonControl.setInProgress = false;
            this.errorInst.ws = this.$translate.instant(
              'server_configuration_installation_ovh_step2_error_set',
              {
                t0: partitionToSet.mountPoint,
                t1: data.message,
              },
            );
          },
        );
      }
    } else {
      this.buttonControl.setInProgress = false;
    }
    this.getRemainingSize();
  }

  cancelSetPartition() {
    this.installation.partitionSchemeModels[
      this.setPartition.indexSet
    ] = angular.copy(this.setPartition.save);
    this.setPartition.save = null;
    this.setPartition.indexSet = -1;
    this.getRemainingSize();
    this.clearError();
  }

  // ------Delete partition------

  deletePartition(partition) {
    this.setPartition.delModel = this.getIndexOfPartition(partition);
    this.getRemainingSize();
  }

  deleteValidPartition() {
    this.buttonControl.deleteInProgress = true;
    this.Server.deleteSetPartition(
      this.informations.gabaritName,
      this.installation.selectPartitionScheme.name,
      this.installation.partitionSchemeModels[this.setPartition.delModel]
        .mountPoint,
    ).then(
      () => {
        if (
          this.installation.partitionSchemeModels[this.setPartition.delModel]
            .isRemainingSizePartition
        ) {
          this.installation.dirtyPartition = true;
        }
        this.installation.partitionSchemeModels.splice(
          this.setPartition.delModel,
          1,
        );
        this.setPartition.delModel = null;
        this.getRemainingSize();
        this.buttonControl.deleteInProgress = false;
        this.clearError();
        this.validationNbDiskUse(this.installation.nbDiskUse);
      },
      (data) => {
        this.buttonControl.deleteInProgress = false;
        this.errorInst.ws = this.$translate.instant(
          'server_configuration_installation_ovh_step2_error_delete',
          {
            t0: this.setPartition.delModel.mountPoint,
            t1: data.data.message,
          },
        );
      },
    );
  }

  deleteCancelPartition() {
    this.setPartition.delModel = null;
    this.getRemainingSize();
  }

  // ------Common partition------

  cancelRaid0Partition() {
    this.buttonControl.displayAddConfirmation = false;
    this.getRemainingSize();
  }

  validPartition() {
    if (this.newPartition.display && !this.buttonControl.addInProgress) {
      this.validAddPartition(true);
    } else if (!this.buttonControl.setInProgress && this.setPartition.save) {
      this.validSetPartition(true);
    }
  }

  hasErrorOrder() {
    return (
      this.errorInst.order ||
      this.errorInst.orderFirst ||
      this.errorInst.orderType ||
      this.errorInst.orderFirstWin
    );
  }

  validationOrder(partition) {
    let firstPartition = partition;
    let hasBoot = false;

    if (!partition.order) {
      if (this.newPartition.display) {
        set(
          partition,
          'order',
          this.installation.partitionSchemeModels.length + 1,
        );
      } else {
        set(partition, 'order', angular.copy(this.setPartition.save.order));
      }
    }
    this.errorInst.order = this.validation.orderList[partition.order];

    if (!this.errorInst.order) {
      angular.forEach(this.installation.partitionSchemeModels, (partition2) => {
        if (partition2.order < firstPartition.order) {
          firstPartition = partition2;
        }
        if (partition2.mountPoint === this.WARNING.WARNING_BOOT) {
          hasBoot = true;
        }
      });
      if (this.newPartition.display) {
        if (partition.mountPoint === this.WARNING.WARNING_BOOT) {
          hasBoot = true;
        }
      }
      if (
        this.installation.selectDistribution.family !==
        this.WARNING.WARNING_WINDOWS
      ) {
        this.errorInst.orderFirst =
          (hasBoot &&
            firstPartition.mountPoint !== this.WARNING.WARNING_BOOT) ||
          (!hasBoot &&
            firstPartition.mountPoint !== this.WARNING.WARNING_ROOT &&
            firstPartition.mountPoint !== this.WARNING.WARNING_BOOT);
      } else {
        this.errorInst.orderFirstWin =
          firstPartition.mountPoint !== this.WARNING.WARNING_CWIN;
      }
    }
    this.validationType(partition);
  }

  // ------TYPE VALIDATION------
  validationVolumeNameByType(partition) {
    this.errorInst.volumeNameEmpty =
      !this.errorInst.typeLvSwap &&
      !this.errorInst.typeLogicalLv &&
      partition.typePartition === this.WARNING.WARNING_LV &&
      (!partition.volumeName || partition.volumeName === '');
  }

  hasErrorType() {
    return (
      this.errorInst.orderType ||
      this.errorInst.typePrimary ||
      this.errorInst.typeLvSwap ||
      this.errorInst.typeLogicalLv ||
      this.errorInst.mountPointPrimary
    );
  }

  validationType(partition) {
    let nbLv = 0;
    let nbLogical = 0;

    this.errorInst.typeLvSwap =
      partition.typePartition === this.WARNING.WARNING_LV &&
      partition.fileSystem === this.WARNING.WARNING_SWAP;

    if (
      this.installation.selectDistribution.family ===
        this.WARNING.WARNING_WINDOWS &&
      partition.mountPoint === this.WARNING.WARNING_CWIN
    ) {
      this.errorInst.mountPointPrimary =
        partition.typePartition !== this.WARNING.WARNING_PRIMARY;
    } else {
      this.errorInst.mountPointPrimary = false;
    }

    this.errorInst.orderType = false;

    // this.errorInst.orderLv = false;
    this.errorInst.typeLogicalLv = false;
    if (
      !this.errorInst.order &&
      !this.errorInst.orderFirst &&
      !this.errorInst.typeLvSwap &&
      !this.errorInst.mountPointPrimary
    ) {
      angular.forEach(this.installation.partitionSchemeModels, (partition2) => {
        // Primary first Test
        if (
          (partition2.order < partition.order &&
            partition2.typePartition !== this.WARNING.WARNING_PRIMARY &&
            partition.typePartition === this.WARNING.WARNING_PRIMARY) ||
          (partition2.order > partition.order &&
            partition2.typePartition === this.WARNING.WARNING_PRIMARY &&
            partition.typePartition !== this.WARNING.WARNING_PRIMARY)
        ) {
          this.errorInst.orderType = true;
        }
        if (partition2.typePartition === this.WARNING.WARNING_LV) {
          nbLv += 1;
        } else if (partition2.typePartition === this.WARNING.WARNING_LOGICAL) {
          nbLogical += 1;
        }
      });
      if (this.newPartition.display) {
        if (partition.typePartition === this.WARNING.WARNING_LV) {
          nbLv += 1;
        } else if (partition.typePartition === this.WARNING.WARNING_LOGICAL) {
          nbLogical += 1;
        }
      }
      if (nbLv !== 0 && nbLogical !== 0) {
        this.errorInst.typeLogicalLv = true;
      }
    }

    this.errorInst.typePrimary =
      !this.errorInst.orderType && this.validationTypePrimary();
    this.validationRaid(partition);
    this.validationVolumeNameByType(partition);
  }

  // ------FILE SYSTEM VALIDATION------

  hasErrorFileSystem() {
    return this.errorInst.fileSystemSwap || this.errorInst.fileSystemNoSwap;
  }

  validationFileSystem(partition) {
    this.errorInst.fileSystemSwap =
      this.validation.hasSwap &&
      partition.fileSystem === this.WARNING.WARNING_SWAP;
    this.errorInst.fileSystemNoSwap =
      this.installation.selectDistribution.family !==
        this.WARNING.WARNING_WINDOWS &&
      !this.validation.hasSwap &&
      partition.fileSystem !== this.WARNING.WARNING_SWAP;
    if (!this.errorInst.fileSystemSwap) {
      if (partition.fileSystem === this.WARNING.WARNING_SWAP) {
        set(partition, 'mountPoint', SWAP_LABEL);
        this.validationMountPoint(partition);
      }
      this.validationSize(partition);
    }
  }

  // ------MOUNT POINT VALIDATION------

  hasErrorMountPoint() {
    return (
      this.errorInst.mountPointUse ||
      this.errorInst.mountPointEmpty ||
      this.errorInst.mountPoint ||
      this.errorInst.mountPoint2 ||
      this.errorInst.mountPointWindows ||
      this.errorInst.orderFirst ||
      this.errorInst.orderFirstWin
    );
  }

  validationMountPoint(partition) {
    this.errorInst.mountPointEmpty = !partition.mountPoint;
    this.errorInst.mountPointUse =
      !this.errorInst.mountPointEmpty &&
      this.validation.mountPointList[partition.mountPoint.toLowerCase()];

    if (partition.fileSystem !== this.WARNING.WARNING_SWAP) {
      if (
        this.installation.selectDistribution.family !==
        this.WARNING.WARNING_WINDOWS
      ) {
        this.errorInst.mountPoint =
          !this.errorInst.mountPointEmpty &&
          !this.errorInst.mountPointUse &&
          (!!~FORBIDDEN_MOUNT_POINT.indexOf(
            partition.mountPoint.toLowerCase(),
          ) ||
          /\/\.{1,2}(\/|$)/.test(partition.mountPoint) || // /../
          /\/-/.test(partition.mountPoint) || // /-
          /\/\//.test(partition.mountPoint) || // //
            !/^\/[A-Za-z0-9._\-/]{0,254}$/.test(partition.mountPoint));

        this.errorInst.mountPoint2 =
          !this.errorInst.mountPointEmpty &&
          !this.errorInst.mountPointUse &&
          !this.errorInst.mountPoint &&
          /^\/var\/log/.test(partition.mountPoint.toLowerCase()) &&
          /^(ovh|gentoo-ovh_64|gentoo-ovh)$/.test(
            this.installation.selectDistribution.family,
          );
      } else if (
        this.installation.selectDistribution.family ===
        this.WARNING.WARNING_WINDOWS
      ) {
        this.errorInst.mountPointWindows =
          !this.errorInst.mountPointEmpty &&
          !this.errorInst.mountPointUse &&
          !/^[c-z]:$/.test(partition.mountPoint.toLowerCase());
      }
    } else {
      this.errorInst.mountPoint = false;
      this.errorInst.mountPoint2 = false;
      this.errorInst.mountPointWindows = false;
    }
    this.validationOrder(partition);
  }

  // ------VOLUME NAME VALIDATION------

  hasErrorVolumeName() {
    return (
      this.errorInst.volumeNameEmpty ||
      this.errorInst.volumeName ||
      this.errorInst.volumeNameUse
    );
  }

  validationVolumeName(partition) {
    this.validationVolumeNameByType(partition);
    this.errorInst.volumeName =
      !this.errorInst.typeLvSwap &&
      !this.errorInst.typeLogicalLv &&
      !this.errorInst.volumeNameEmpty &&
      partition.typePartition === this.WARNING.WARNING_LV &&
      (!/^[a-zA-Z0-9]{1,16}$/.test(partition.volumeName) ||
        partition.volumeName.toLowerCase() === 'snapshot' ||
        partition.volumeName.toLowerCase() === 'pvmove');
    this.errorInst.volumeNameUse =
      !this.errorInst.typeLvSwap &&
      !this.errorInst.typeLogicalLv &&
      !this.errorInst.volumeNameEmpty &&
      !this.errorInst.volumeName &&
      partition.typePartition === this.WARNING.WARNING_LV &&
      this.validation.volumeNameList[partition.volumeName.toLowerCase()];
  }

  // ------Soft RAID VALIDATION------

  hasErrorRaid() {
    return this.errorInst.raid0 || this.errorInst.raidLv;
  }

  validationRaid(partition) {
    this.errorInst.raidLv = false;
    if (this.installation.nbDiskUse > 1 && !this.informations.raidController) {
      this.errorInst.raid0 =
        partition.raid !== this.WARNING.WARNING_RAID1 &&
        partition.raid !== this.WARNING.WARNING_RAID0 &&
        (partition.mountPoint === this.WARNING.WARNING_BOOT ||
          partition.mountPoint === this.WARNING.WARNING_ROOT);
      this.warning.raid0 =
        !this.errorInst.raid0 &&
        partition.raid === this.WARNING.WARNING_RAID0 &&
        partition.fileSystem !== this.WARNING.WARNING_SWAP;
    }
    if (
      this.installation.nbDiskUse > 1 &&
      !this.informations.raidController &&
      partition.typePartition === this.WARNING.WARNING_LV
    ) {
      angular.forEach(this.installation.partitionSchemeModels, (partition2) => {
        if (
          partition2.typePartition === this.WARNING.WARNING_LV &&
          partition2.raid !== partition.raid
        ) {
          this.errorInst.raidLv = true;
        }
      });
    }

    this.validationSize(partition);
  }

  // ------SIZE VALIDATION------

  hasErrorSize() {
    return (
      this.errorInst.partitionSizeOver ||
      this.errorInst.partitionSizeSwap ||
      this.errorInst.partitionSize ||
      this.errorInst.partitionSizeBoot ||
      this.errorInst.partitionSizeReiserfs ||
      this.errorInst.partitionSizeWindows ||
      this.errorInst.partitionSizeMin ||
      this.errorInst.partitionSizeRequired
    );
  }

  // swap size > 30Go = error
  validationSizeSwap(partition) {
    this.errorInst.partitionSizeSwap =
      partition.fileSystem === this.WARNING.WARNING_SWAP &&
      this.getRealDisplaySize({
        partition,
        notDisplay: true,
        noRaid: true,
      }) > this.SIZE.MAX_SIZE_SWAP;
    return this.errorInst.partitionSizeSwap;
  }

  // partition size > 2To = error
  validationSizeMax(partition) {
    this.errorInst.partitionSize =
      partition.fileSystem !== this.WARNING.WARNING_ZFS &&
      !this.installation.selectDistribution.supportsGpt &&
      this.getRealDisplaySize({
        partition,
        notDisplay: true,
        noRaid: true,
      }) > this.SIZE.MAX_SIZE_PARTITION;
    return this.errorInst.partitionSize;
  }

  // boot size < 50Mo = error
  validationSizeBoot(partition) {
    this.errorInst.partitionSizeBoot =
      partition.mountPoint === this.WARNING.WARNING_BOOT &&
      this.getRealDisplaySize({
        partition,
        notDisplay: true,
        noRaid: true,
      }) < this.SIZE.MIN_SIZE_BOOT;
    return this.errorInst.partitionSizeBoot;
  }

  // reiserfs size < 32Mo = error
  validationSizeReiserfs(partition) {
    this.errorInst.partitionSizeReiserfs =
      partition.fileSystem === this.WARNING.WARNING_REISERFS &&
      this.getRealDisplaySize({
        partition,
        notDisplay: true,
        noRaid: true,
      }) < this.SIZE.MIN_SIZE_REISERFS;
    return this.errorInst.partitionSizeReiserfs;
  }

  // windows size < 20Go = error
  validationSizeWindowsMin(partition) {
    this.errorInst.partitionSizeWindows =
      this.installation.selectDistribution.family ===
        this.WARNING.WARNING_WINDOWS &&
      this.getRealDisplaySize({
        partition,
        notDisplay: true,
        noRaid: true,
      }) < this.SIZE.MIN_SIZE_WINDOWS;
    return this.errorInst.partitionSizeWindows;
  }

  // partition size < 10Mo = error
  validationSizeMin(partition) {
    this.errorInst.partitionSizeMin =
      this.getRealDisplaySize({
        partition,
        notDisplay: true,
        noRaid: true,
      }) < this.SIZE.MIN_SIZE_PARTITION;
    return this.errorInst.partitionSizeMin;
  }

  validationSize(partition) {
    if (partition.partitionSize) {
      set(
        partition,
        'partitionSize',
        parseInt(partition.partitionSize.toString().replace('.', ''), 10),
      );
    }
    this.errorInst.partitionSizeRequired = !/^[0-9]{1,20}$/.test(
      partition.partitionSize,
    );

    this.getRemainingSize();
    return (
      this.errorInst.partitionSizeOver ||
      this.validationSizeSwap(partition) ||
      this.validationSizeMax(partition) ||
      this.validationSizeBoot(partition) ||
      this.validationSizeReiserfs(partition) ||
      this.validationSizeWindowsMin(partition) ||
      this.validationSizeMin(partition)
    );
  }

  // ------END VALIDATION------

  // ------TOOLS------

  // return range between 1 and nbdisque of server if > 1
  static getNbDisqueList(nbdisk) {
    if (nbdisk > 1) {
      return range(1, nbdisk + 1);
    }
    return [nbdisk];
  }

  // return list of available raid
  getRaidList(nbDisk) {
    if (nbDisk !== null && this.data.raidList !== null) {
      if (nbDisk >= 4) {
        if (nbDisk % 2 === 0) {
          return this.data.raidList[4] || [];
        }
        return this.data.raidList[3] || [];
      }
      return this.data.raidList[nbDisk] || [];
    }
    return [];
  }

  // Reture true if partition is in edit mode
  isSetPartition(partition) {
    return (
      this.installation.partitionSchemeModels[this.setPartition.indexSet] ===
      partition
    );
  }

  // Display size with unit (recursive)
  getDisplaySize(octetsSize, unitIndex = 0) {
    if (!Number.isNaN(octetsSize)) {
      if (octetsSize >= 1000 && unitIndex < UNITS.length - 1) {
        return this.getDisplaySize(octetsSize / 1000, unitIndex + 1);
      }
      return `${parseFloat(octetsSize).toFixed(1)} ${this.$translate.instant(
        `unit_size_${UNITS[unitIndex].LABEL}`,
      )}`;
    }
    return '';
  }

  getFullSize(partition) {
    set(partition, 'partitionSize', 0); // important
    set(partition, 'partitionSize', this.getRealRemainingSize(partition.raid));
    this.validationSize(partition);
  }

  // Display real space depending on the raid. if setting or adding,
  // {partition, notDisplay, noRaid}
  getRealDisplaySize(option) {
    if (option.partition && option.partition.takeRemainingSpace) {
      return this.getDisplaySize(this.getRemainingSize());
    }
    if (option.partition && !Number.isNaN(option.partition.partitionSize)) {
      if (
        option.noRaid ||
        this.installation.nbDiskUse === 1 ||
        this.informations.raidController
      ) {
        set(option, 'partition.realSize', option.partition.partitionSize);
      } else if (option.partition.raid) {
        switch (option.partition.raid) {
          case '_0':
            set(option, 'partition.realSize', option.partition.partitionSize);
            break;
          case '_1':
            set(
              option,
              'partition.realSize',
              option.partition.partitionSize * this.installation.nbDiskUse,
            );
            break;
          case '_5':
            set(
              option,
              'partition.realSize',
              option.partition.partitionSize +
                option.partition.partitionSize /
                  (this.installation.nbDiskUse - 1),
            );
            break;
          case '_6':
            set(
              option,
              'partition.realSize',
              option.partition.partitionSize * 2,
            );
            break;
          case '_10':
            set(
              option,
              'partition.realSize',
              option.partition.partitionSize *
                (this.installation.nbDiskUse / 2),
            );
            break;
          default:
            break;
        }
      }
      if (option.notDisplay) {
        return option.partition.realSize;
      }
      return this.getDisplaySize(option.partition.realSize);
    }
    return null;
  }

  // get remaining size
  getRemainingSize() {
    let remainingSize = this.informations.totalSize;

    // all partition
    angular.forEach(this.installation.partitionSchemeModels, (partition) => {
      if (partition.partitionSize) {
        remainingSize -= this.getRealDisplaySize({
          partition,
          notDisplay: true,
        });
      }
    });

    // new partition
    if (
      this.newPartition.display &&
      !Number.isNaN(this.newPartition.partitionSize)
    ) {
      remainingSize -= this.getRealDisplaySize({
        partition: this.newPartition,
        notDisplay: true,
      });
    }

    // delete partition
    if (
      this.setPartition.delModel &&
      this.installation.partitionSchemeModels[this.setPartition.delModel] &&
      !Number.isNaN(
        this.installation.partitionSchemeModels[this.setPartition.delModel]
          .partitionSize,
      )
    ) {
      remainingSize += this.getRealDisplaySize({
        partition: this.installation.partitionSchemeModels[
          this.setPartition.delModel
        ],
        notDisplay: true,
      });
    }

    this.informations.remainingSize = remainingSize;
    this.errorInst.partitionSizeOver = false;

    if (remainingSize < 0) {
      this.errorInst.partitionSizeOver = true;
      this.informations.remainingSize = 0;
    }
    this.refreshBar();

    return this.informations.remainingSize;
  }

  static getRandomColor(index, partition) {
    const colorSequence = [
      '#E91E63',
      '#3F51B5',
      '#00BCD4',
      '#8BC34A',
      '#FFC107',
      '#795548',
      '#9C27B0',
      '#2196F3',
      '#009688',
      '#CDDC39',
      '#FF9800',
      '#607D8B',
    ];

    let color =
      colorSequence[Math.floor(Math.random() * (colorSequence.length - 1))];
    if (index) {
      color =
        colorSequence[(colorSequence.length - index) % colorSequence.length];
    }

    if (partition) {
      set(partition, 'progressColor', color);
    }
    return color;
  }

  getBarWidth(partition) {
    return parseFloat(
      (this.getRealDisplaySize({
        partition,
        notDisplay: true,
      }) *
        100) /
        this.informations.totalSize,
    ).toFixed(1);
  }

  getProgress(partition) {
    let progress = parseFloat(this.getBarWidth(partition));
    if (this.bar.total < 100.0) {
      if (progress + this.bar.total > 100.0) {
        progress = 100.0 - this.bar.total;
      }
      this.bar.progress.push({
        partition,
        progressSize: progress,
      });
    }
    this.bar.total += progress;
  }

  refreshBar() {
    this.bar.progress = [];
    this.bar.total = 0;

    angular.forEach(this.installation.partitionSchemeModels, (partition) => {
      this.getProgress(partition);
    });
    if (this.newPartition.display) {
      this.getProgress(this.newPartition);
    }
  }

  recalculateAvailableRaid() {
    if (this.installation.hardwareRaid.controller) {
      const nbOfDisk = this.installation.hardwareRaid.controller.disks[0].names
        .length;
      this.installation.hardwareRaid.raid = null;
      this.informations.hardwareRaid.availableDisks = [];
      this.informations.hardwareRaid.availableRaids = [];

      for (let i = 1; i < nbOfDisk + 1; i += 1) {
        this.informations.hardwareRaid.availableDisks.push(i);
      }
      if (nbOfDisk >= 8) {
        this.informations.hardwareRaid.availableRaids.push(
          TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID60,
        );
      }
      if (nbOfDisk >= 6) {
        this.informations.hardwareRaid.availableRaids.push(
          TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID50,
        );
      }
      if (nbOfDisk >= 4) {
        this.informations.hardwareRaid.availableRaids.push(
          TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID6,
        );
        this.informations.hardwareRaid.availableRaids.push(
          TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID10,
        );
      }
      if (nbOfDisk >= 3) {
        this.informations.hardwareRaid.availableRaids.push(
          TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID5,
        );
      }
      if (nbOfDisk >= 2) {
        this.informations.hardwareRaid.availableRaids.push(
          TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID1,
        );
        this.informations.hardwareRaid.availableRaids.push(
          TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID0,
        );
      }
    }
  }

  recalculateAvailableRaidDisks() {
    if (this.installation.hardwareRaid.controller) {
      const nbOfDisk = this.installation.hardwareRaid.controller.disks[0].names
        .length;
      let minDisks = 1;
      let minDisksPerArray = 1;
      this.informations.hardwareRaid.availableDisks = [];
      this.installation.hardwareRaid.disks = null;

      switch (this.installation.hardwareRaid.raid) {
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID60:
          minDisks = 8;
          minDisksPerArray = 4;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID50:
          minDisks = 6;
          minDisksPerArray = 3;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID10:
          minDisksPerArray = 2;
          minDisks = 4;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID6:
          minDisks = 4;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID5:
          minDisks = 3;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID1:
          minDisks = 2;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID0:
          minDisks = 2;
          break;
        default:
          minDisks = 1;
      }

      for (let i = minDisks; i < nbOfDisk + 1; i += minDisksPerArray) {
        this.informations.hardwareRaid.availableDisks.push(i);
      }
    }
  }

  recalculateAvailableArrays() {
    if (
      this.installation.hardwareRaid.disks &&
      this.installation.hardwareRaid.controller
    ) {
      let maxNumberArray = this.installation.hardwareRaid.controller.disks[0]
        .names.length;
      let minNumberArray = 1;
      let isMultipleArrays = false;
      this.informations.hardwareRaid.availableArrays = [];
      this.installation.hardwareRaid.arrays = null;

      switch (this.installation.hardwareRaid.raid) {
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID60:
          maxNumberArray = this.installation.hardwareRaid.disks / 4;
          minNumberArray = 2;
          isMultipleArrays = true;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID50:
          maxNumberArray = this.installation.hardwareRaid.disks / 3;
          minNumberArray = 2;
          isMultipleArrays = true;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID10:
          maxNumberArray = this.installation.hardwareRaid.disks / 2;
          minNumberArray = 2;
          isMultipleArrays = true;
          break;
        default:
          break;
      }

      if (isMultipleArrays) {
        for (let i = minNumberArray; i <= maxNumberArray; i += 1) {
          if (this.installation.hardwareRaid.disks % i === 0) {
            this.informations.hardwareRaid.availableArrays.push(i);
          }
        }
      } else {
        this.informations.hardwareRaid.availableArrays = [1];
        this.installation.hardwareRaid.arrays = 1;
        this.recalculateSpace();
      }
    }
  }

  recalculateSpace() {
    if (
      this.installation.hardwareRaid.disks &&
      this.installation.hardwareRaid.arrays &&
      this.installation.hardwareRaid.controller
    ) {
      let diskSize = this.installation.hardwareRaid.controller.disks[0].capacity
        .value;
      const grappe = this.installation.hardwareRaid.arrays;
      const nbOfDisks = this.installation.hardwareRaid.disks;

      angular.forEach(UNITS, (UNIT) => {
        if (
          UNIT.LABEL ===
          this.installation.hardwareRaid.controller.disks[0].capacity.unit
        ) {
          diskSize *= UNIT.VALUE;
        }
      });

      this.installation.hardwareRaid.totalSpace =
        this.installation.hardwareRaid.disks * diskSize;
      switch (this.installation.hardwareRaid.raid) {
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID60:
          this.installation.hardwareRaid.availableSpace =
            (nbOfDisks - 2 * grappe) * diskSize;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID50:
          this.installation.hardwareRaid.availableSpace =
            (nbOfDisks - grappe) * diskSize;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID10:
          this.installation.hardwareRaid.availableSpace = grappe * diskSize;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID6:
          this.installation.hardwareRaid.availableSpace =
            (nbOfDisks - 2) * diskSize;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID5:
          this.installation.hardwareRaid.availableSpace =
            (nbOfDisks - 1) * diskSize;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.RAID1:
          this.installation.hardwareRaid.availableSpace = diskSize;
          break;
        default:
          this.installation.hardwareRaid.availableSpace = this.installation.hardwareRaid.totalSpace;
      }
    }
  }

  invalidHardRaid() {
    return (
      this.installation.hardwareRaid.disks %
        this.installation.hardwareRaid.arrays !==
      0
    );
  }

  clearHardwareRaidSpace() {
    this.installation.hardwareRaid.availableSpace = null;
    this.installation.hardwareRaid.totalSpace = null;
  }

  prepareDiskList() {
    const disksPerArray =
      this.installation.hardwareRaid.disks /
      this.installation.hardwareRaid.arrays;
    if (this.installation.hardwareRaid.arrays === 1) {
      return take(
        this.installation.hardwareRaid.controller.disks[0].names,
        this.installation.hardwareRaid.disks,
      );
    }

    // API expect something like this...:
    // "disks": [
    //    "[c0:d0, c0:d1, c0:d2]",
    //    "[c0:d3, c0:d4, c0:d5]",
    //    "[c0:d6, c0:d7, c0:d8]",
    //    "[c0:d9, c0:d10, c0:d11]"
    // ]
    return map(
      chunk(
        take(
          this.installation.hardwareRaid.controller.disks[0].names,
          this.installation.hardwareRaid.disks,
        ),
        disksPerArray,
      ),
      (elem) => `[${elem.toString()}]`,
    );
  }

  // ------CUSTOME STEP MODAL------
  reduceModal() {
    this.$scope.setToBigModalDialog(false);
  }

  extendModal() {
    this.$scope.setToBigModalDialog(true);
  }

  checkNextStep1() {
    if (!this.installation.raidSetup) {
      if (this.installation.customInstall) {
        this.extendModal();
        this.$rootScope.$broadcast('wizard-goToStep', 3);
      } else {
        this.extendModal();
        this.$rootScope.$broadcast('wizard-goToStep', 4);
      }
    }
  }

  checkNextStep2() {
    this.extendModal();
    if (!this.installation.customInstall) {
      this.$rootScope.$broadcast('wizard-goToStep', 4);
    }
  }

  checkPrev1() {
    if (!this.installation.raidSetup) {
      this.reduceModal();
      this.$rootScope.$broadcast('wizard-goToStep', 1);
    } else {
      this.reduceModal();
    }
  }

  checkCustomPrevFinal() {
    if (!this.installation.customInstall) {
      if (!this.installation.raidSetup) {
        this.reduceModal();
        this.$rootScope.$broadcast('wizard-goToStep', 1);
      } else {
        this.reduceModal();
        this.$rootScope.$broadcast('wizard-goToStep', 2);
      }
    } else {
      this.extendModal();
    }
  }

  addRemainingSize() {
    const remainingSize = this.getRemainingSize();

    if (
      (this.SIZE.MIN_SIZE_PARTITION > remainingSize &&
        this.installation.selectDistribution.family !==
          this.WARNING.WARNING_WINDOWS) ||
      (this.SIZE.MIN_SIZE_WINDOWS > remainingSize &&
        this.installation.selectDistribution.family ===
          this.WARNING.WARNING_WINDOWS)
    ) {
      angular.forEach(this.installation.partitionSchemeModels, (partition) => {
        if (
          !this.installation.options.variablePartition ||
          (this.installation.options.variablePartition.partitionSize <
            partition.partitionSize &&
            this.installation.options.variablePartition.partitionSize !== 0)
        ) {
          this.installation.options.variablePartition = partition;
          this.installation.variablePartition = true;
        }
      });
    }
  }

  checkIntegrity() {
    this.errorInst.ws = null;
    this.installation.variablePartition = false;
    this.installation.options = {
      saveGabarit: false,
      gabaritNameSave: null,
      changeLog: null,
      customHostname: null,
      postInstallationScriptLink: null,
      postInstallationScriptReturn: null,
      sshKeyName: null,
      useDistributionKernel: false,
      installSqlServer: false,
      useSpla: false,
      variablePartition: null,
      validForm: true,
    };
    if (this.installation.customInstall && this.informations.gabaritName) {
      this.loader.loading = true;
      this.Server.checkIntegrity(this.informations.gabaritName).then(
        () => {
          this.loader.loading = false;
        },
        (data) => {
          this.loader.loading = false;
          this.errorInst.ws = this.$translate.instant(
            'server_configuration_installation_ovh_step3_error_integrity',
            { t0: data },
          );
        },
      );
      this.addRemainingSize();
    } else {
      this.loadPartiton();
    }
  }

  // ------INSTALL------
  validationGabaritName() {
    this.errorInst.gabaritName = !/^[a-zA-Z0-9_-]{1,50}$/.test(
      this.installation.gabaritNameSave,
    );
  }

  getMountPoint() {
    const list = [];
    angular.forEach(this.installation.partitionSchemeModels, (partition) => {
      if (partition.fileSystem !== this.WARNING.WARNING_SWAP) {
        list.push(partition);
      }
    });
    return list;
  }

  saveRemainingSize(_size, stop) {
    let size = _size;

    if (!stop) {
      this.errorInst.wsinstall = null;
    }
    if (this.installation.customInstall) {
      // if install fail before start
      if (!size) {
        size = 0;
        if (this.installation.options.variablePartition) {
          this.installation.saveSize = this.installation.options.variablePartition.partitionSize;
        }
      }

      // if user has check, change variable partition and uncheck save gabarit
      if (!this.installation.options.saveGabarit) {
        this.addRemainingSize();
      }

      if (this.installation.options.variablePartition) {
        this.loader.loading = true;
        this.Server.putSetPartition(
          this.informations.gabaritName,
          this.installation.selectPartitionScheme.name,
          {
            raid: this.installation.options.variablePartition.raid,
            fileSystem: this.installation.options.variablePartition.fileSystem,
            typePartition: this.installation.options.variablePartition
              .typePartition,
            volumeName: this.installation.options.variablePartition.volumeName,
            order: this.installation.options.variablePartition.order,
            mountPoint: this.installation.options.variablePartition.mountPoint,
            oldMountPoint: this.installation.options.variablePartition
              .mountPoint,
            partitionSize: size,
          },
        ).then(
          () => {
            if (!stop) {
              this.install();
            } else {
              this.loader.loading = false;
            }
          },
          (data) => {
            this.loader.loading = false;
            if (size === 0) {
              this.errorInst.wsinstall = this.$translate.instant(
                'server_configuration_installation_ovh_step3_remaining_error',
                {
                  t0: this.installation.options.variablePartition.mountPoint,
                  t1: data.message,
                },
              );
            } // else it's revert size
          },
        );
      } else if (!stop) {
        this.install();
      }
    } else if (!stop) {
      this.install();
    }
  }

  isDefaultDiskGroup(diskGroup) {
    return (
      diskGroup &&
      this.informations.diskGroups[0].diskGroupId === diskGroup.diskGroupId
    );
  }

  startInstall() {
    this.loader.loading = true;
    this.Server.startInstallation(
      this.$stateParams.productId,
      this.informations.gabaritName,
      {
        language: camelCase(this.installation.selectLanguage),
        customHostname: this.installation.options.customHostname,
        installSqlServer: this.installation.options.installSqlServer,
        postInstallationScriptLink: this.installation.options
          .postInstallationScriptLink,
        postInstallationScriptReturn: this.installation.options
          .postInstallationScriptLink
          ? this.installation.options.postInstallationScriptReturn
          : null,
        sshKeyName: this.installation.options.sshKeyName,
        useDistribKernel: this.installation.options.useDistributionKernel,
        useSpla: this.installation.options.useSpla,
        softRaidDevices:
          this.informations.nbDisk > 2 && this.installation.nbDiskUse > 1
            ? this.installation.nbDiskUse
            : null,
        noRaid:
          this.installation.nbDiskUse === 1 &&
          !this.informations.raidController,
        diskGroupId: !this.isDefaultDiskGroup(this.installation.diskGroup)
          ? this.installation.diskGroup.diskGroupId
          : null,
        resetHwRaid: !this.isDefaultDiskGroup(this.installation.diskGroup),
      },
    ).then(
      (task) => {
        set(task, 'id', task.taskId);
        this.reduceModal();
        this.$scope.setMessage(null);
        this.$rootScope.$broadcast('dedicated.informations.reinstall', task);
        this.$scope.setAction(
          'installation/progress/dedicated-server-installation-progress',
          this.data.server,
        );
        this.loader.loading = false;
      },
      (data) => {
        this.saveRemainingSize(this.installation.saveSize, true);
        this.errorInst.wsinstall = this.$translate.instant(
          'server_configuration_installation_ovh_step3_error',
          {
            t0: this.installation.selectDistribution.displayName,
            t1: this.data.server.name,
            t2: this.installation.selectLanguage,
            t3: data.message,
          },
        );
        this.loader.loading = false;
      },
    );
  }

  setHardwareRaid() {
    const disks = this.prepareDiskList();

    this.Server.postHardwareRaid(
      this.$stateParams.productId,
      this.informations.gabaritName,
      this.installation.selectPartitionScheme.name,
      disks,
      this.installation.hardwareRaid.raid,
    )
      .catch((error) => {
        if (error.status === 409) {
          return this.Server.putHardwareRaid(
            this.$stateParams.productId,
            this.informations.gabaritName,
            this.installation.selectPartitionScheme.name,
            disks,
            this.installation.hardwareRaid.raid,
          );
        }
        return this.$q.reject(error);
      })
      .then(() => {
        this.startInstall();
      })
      .catch(() => {
        this.loader.loading = false;
        this.saveRemainingSize(this.installation.saveSize, true);
        this.errorInst.wsinstall = this.$translate.instant(
          'server_configuration_installation_error_hardwareRaid',
        );
      });
  }

  setGabarit() {
    this.Server.putSetGabarit(
      this.$stateParams.productId,
      this.informations.gabaritName,
      this.installation.options.gabaritNameSave,
      {
        changeLog: this.installation.options.changeLog,
        customHostname: this.installation.options.customHostname,
        postInstallationScriptLink: this.installation.options
          .postInstallationScriptLink,
        postInstallationScriptReturn: this.installation.options
          .postInstallationScriptLink
          ? this.installation.options.postInstallationScriptReturn
          : null,
        sshKeyName: this.installation.options.sshKeyName,
        useDistributionKernel: this.installation.options.useDistributionKernel,
      },
    ).then(
      () => {
        this.informations.gabaritName = angular.copy(
          this.installation.options.gabaritNameSave,
        );
        if (this.installation.hardwareRaid.raid) {
          this.setHardwareRaid();
        } else {
          this.startInstall();
        }
      },
      (data) => {
        this.loader.loading = false;
        this.saveRemainingSize(this.installation.saveSize, true);
        this.errorInst.wsinstall = this.$translate.instant(
          'server_configuration_installation_error_save',
          { t0: data.data.message },
        );
      },
    );
  }

  install() {
    if (this.installation.options.saveGabarit) {
      this.loader.loading = true;
      this.setGabarit();
    } else if (this.installation.hardwareRaid.raid) {
      this.installation.options.gabaritNameSave = `tmp-mgr-hardwareRaid-${moment().unix()}`;
      this.setGabarit();
    } else {
      this.startInstall();
    }
  }

  canPersonnalizeRaid() {
    return (
      this.raidIsPersonnalizable() &&
      this.isDefaultDiskGroup(this.installation.diskGroup)
    );
  }

  raidIsPersonnalizable() {
    return (
      this.data.server.raidController &&
      get(this.installation, 'selectDistribution.hardRaidConfiguration') !==
        false &&
      !this.informations.hardwareRaid.error.wrongLocation &&
      !this.informations.hardwareRaid.error.notAvailable
    );
  }

  canEditDiskGroup() {
    return (
      this.informations.diskGroups.length > 1 &&
      this.installation.isHybridCompatible
    );
  }

  hasVirtualDesktop() {
    return !includes(get(this.installation, 'selectDistribution.id'), 'hyperv');
  }

  hasLicencedOs() {
    return find(
      this.installation.distributionList,
      (distribution) => distribution.family === 'WINDOWS',
    );
  }
}
