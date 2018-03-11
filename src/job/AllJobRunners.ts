import { buildJob } from "./BuildJob";
import { harvestJob } from "./HarvestJob";
import { Job, JobRunner } from "./JobRunner";
import { sleepJob } from "./SleepJob";
import { storeEnergyJob } from "./StoreEnergyJob";
import { upgradJob } from "./UpgradJob";

export let allJobRunners: ILookup<JobRunner> = {
    [Job.Build]: buildJob,
    [Job.Harvest]: harvestJob,
    [Job.Sleep]: sleepJob,
    [Job.StoreEnergy]: storeEnergyJob,
    [Job.Upgrad]: upgradJob
};
