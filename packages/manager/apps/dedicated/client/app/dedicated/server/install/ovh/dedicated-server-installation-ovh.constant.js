export const FORBIDDEN_MOUNT_POINT = [
  '/etc',
  '/bin',
  '/sbin',
  '/dev',
  '/lib',
  '/lib64',
  '/lost+found',
  '/proc',
  '/sys',
];

export const SIZE = {
  MAX_SIZE_SWAP: 30000, // = 30Go
  MAX_SIZE_PARTITION: 2000000, // =  2To
  MIN_SIZE_PARTITION: 10, // = 10Mo
  MIN_SIZE_WINDOWS: 32768, // = 32Go
  MIN_SIZE_REISERFS: 32, // = 32Mo
  MIN_SIZE_BOOT: 50, // = 50Mo
};

export const SWAP_LABEL = 'swap';

export const TEMPLATE_OS_HARDWARE_RAID_ENUM = {
  RAID0: 'raid0',
  RAID1: 'raid1',
  RAID5: 'raid5',
  RAID6: 'raid6',
  RAID10: 'raid10',
  RAID50: 'raid50',
  RAID60: 'raid60',
};

export const UNITS = [
  {
    LABEL: 'MB',
    VALUE: 1,
  },
  {
    LABEL: 'GB',
    VALUE: 1000,
  },
  {
    LABEL: 'TB',
    VALUE: 1000000,
  },
];

export const WARNING = {
  WARNING_RAID0: '_0',
  WARNING_RAID1: '_1',
  WARNING_LV: 'LV',
  WARNING_LOGICAL: 'LOGICAL',
  WARNING_PRIMARY: 'PRIMARY',
  WARNING_SWAP: 'SWAP',
  WARNING_REISERFS: 'REISERFS',
  WARNING_WINDOWS: 'WINDOWS',
  WARNING_BOOT: '/boot',
  WARNING_ROOT: '/',
  WARNING_CWIN: 'c:',
  WARNING_NTFS: 'NTFS',
  WARNING_EXT4: 'EXT_4',
  WARNING_LINUX: 'LINUX',
  WARNING_ZFS: 'ZFS',
};

export default {
  FORBIDDEN_MOUNT_POINT,
  SIZE,
  SWAP_LABEL,
  TEMPLATE_OS_HARDWARE_RAID_ENUM,
  UNITS,
  WARNING,
};
