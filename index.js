import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import random from 'random';

const path = "./data.json";

const isValidDate = (date) => {
    const startDate = moment("2019-01-01");
    const endDate = moment("2024-12-31");
    return date.isBetween(startDate, endDate, null, "[]");
};

const markCommit = async (date) => {
    const data = { date: date.toISOString() };
    await jsonfile.writeFile(path, data);

    const git = simpleGit();
    await git.add(path);
    await git.commit(date.toISOString(), { "--date": date.toISOString() });
};

const makeCommits = async (n) => {
    const git = simpleGit();

    for (let i = 0; i < n; i++) {
        const randomWeek = random.int(0, 54 * 4);
        const randomDay = random.int(0, 6);

        const ramdomDate = moment("2019-01-01").add(randomWeek, "weeks").add(randomDay, "days");

        if (isValidDate(ramdomDate)) {
            console.log(`Creating commit: ${ramdomDate.toISOString()}`);
            await markCommit(ramdomDate);
        } else {
            console.log(`Invalid date: ${ramdomDate.toISOString()}, skipping...`);
        }
    }

    console.log("Pushing all commits...");
    await git.push();
};

makeCommits(50000);