import { Player } from "@/types/player";
import { Team } from "@/types/team";
function* combinations<T>(list: T[], length: number): IterableIterator<T[]> {
  if (length === 0) {
    yield [];
  } else {
    for (let i = 0; i < list.length; i++) {
      for (const combination of combinations(list.slice(i + 1), length - 1)) {
        yield [list[i], ...combination];
      }
    }
  }
}

function calculateTotalRating(list: Player[]) {
  return list.map((p) => p.rating).reduce((r1, r2) => r1 + r2, 0);
}

function calculateCount(list: Player[], prop: string) {
  type ObjectKey = keyof Player;

  const myVar = prop as ObjectKey;
  return list.map((p) => Number(p[myVar])).reduce((r1, r2) => r1 + r2, 0);
}

function generateTeams(list: Player[]) {
  const highPriorities = list.filter((p) => p.highPriority ?? false);
  const remaining = list.filter((p) => !highPriorities.includes(p));
  const total = calculateTotalRating(list);
  const limit = total / 2 - 2;

  const teams = combinations<Player>(
    remaining,
    list.length / 2 - highPriorities.length
  );
  const filtered = Array.from(filterTeams(teams, highPriorities, limit));
  //Returns first 10 team recommendation sorted by low priority count then rating.
  return filtered
    .sort((t1, t2) => {
      if (t1.lowPriorityCount !== t2.lowPriorityCount) {
        return t2.lowPriorityCount - t1.lowPriorityCount;
      }
      return t2.rating - t1.rating;
    })
    .slice(0, 10);
}
function* filterTeams(
  teams: IterableIterator<Player[]>,
  priorities: Player[],
  limit: number
): IterableIterator<Team> {
  const priorityRating = calculateTotalRating(priorities);
  const priorityGoalKeeperCount = calculateCount(priorities, "goalKeeper");
  for (const team of teams) {
    const teamRating = calculateTotalRating(team) + priorityRating;
    const lowPriorityCount = calculateCount(team, "lowPriority");
    const goalKeeperCount =
      calculateCount(team, "goalKeeper") + priorityGoalKeeperCount;
    if (teamRating <= limit && teamRating >= limit - 2 && goalKeeperCount < 2) {
      yield {
        players: [...team, ...priorities],
        rating: teamRating,
        lowPriorityCount: lowPriorityCount,
      };
    }
  }
}
export default generateTeams;
