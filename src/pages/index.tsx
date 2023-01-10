import * as React from "react";
//@ts-ignore
import { Match } from "regexp";
import { Player } from "@/types/player";
import { Team } from "@/types/team";
import generateTeams from "@/utils/team.selector";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
export default function IndexPage() {
  const [input, setInput] = React.useState("");
  const [tableData, setTableData] = React.useState([] as Player[]);
  const [teamData, setTeamData] = React.useState([] as Team[]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };
  const parse = (input: string) => {
    const players: Player[] = [];

    // Use a regular expression to find players in the input string
    const regex = /(?<name>.+)\((?<rating>\d{2})(?<gk>, kaleci){0,1}\)/gm;

    // Alternative syntax using RegExp constructor
    // const regex = new RegExp('(?P<name>.+)\\((?P<rating>\\d{2})(?P<gk>, kaleci){0,1}\\)', 'gm')

    const str = `volkan gulen (13)
`;
    let m;

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
      });
    }
    let match: Match;
    while ((match = regex.exec(input))) {
      const name = match.groups.name;
      const rating = parseInt(match.groups.rating, 10);
      const goalKeeper = !!match.groups.gk;
      players.push({ name, rating, goalKeeper });
    }

    return players;
  };

  const toggleLowPriority = (player: Player) => {
    if (player.highPriority) {
      player.highPriority = false;
      player.lowPririty = true;
    } else {
      player.lowPririty = !player.lowPririty;
    }
    const remaining = tableData.filter((p) => p.name != player.name);
    setTableData([player, ...remaining]);
  };
  const toggleHighPriority = (player: Player) => {
    if (player.lowPririty) {
      player.lowPririty = false;
      player.highPriority = true;
    } else {
      player.highPriority = !player.highPriority;
    }
    const remaining = tableData.filter((p) => p.name != player.name);
    setTableData([player, ...remaining]);
  };

  const handleGenerate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const teams = generateTeams(tableData);
    setTeamData(teams);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedData = parse(input);
    console.log(parsedData);
    setTableData(parsedData);
  };
  return (
    <>
      <div>
        <form className="w-full " onSubmit={handleSubmit}>
          <textarea
            className="block p-2.5 h-full w-full text-sm text-gray-400 bg-gray-800 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Insert team list here!"
            rows={14}
            onChange={handleChange}
            value={input}
          />
          <button
            className="w-full text-gray-900 bg-green-400 rounded-lg-border border-gray-300 hover:ring-blue-500 mt-4"
            type="submit"
          >
            Parse
          </button>
        </form>

        {tableData.length > 0 && (
          <form onSubmit={handleGenerate}>
            <div className="relative overflow-x-auto mt-4">
              <table className="w-full text-sm text-left text-gray-400 dark:text-gray-400">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Rating
                    </th>

                    <th scope="col" className="px-6 py-3">
                      GoalKeeper
                    </th>
                    <th scope="col" className="px-6 py-3">
                      High Priority
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Low Priority
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData
                    .sort((p1, p2) => p2.rating - p1.rating)
                    .map((player) => (
                      <tr
                        className="bg-gray-800 border-gray-700"
                        key={player.name}
                      >
                        <td className="px-6 py-4">{player.name}</td>
                        <td className="px-6 py-4">{player.rating}</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            disabled
                            checked={player.goalKeeper}
                          />
                        </td>
                        <td
                          className="px-6 py-4 hover:cursor-pointer"
                          onClick={() => toggleHighPriority(player)}
                        >
                          <input
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            type="checkbox"
                            checked={player.highPriority}
                          />
                        </td>
                        <td
                          className="px-6 py-4 hover:cursor-pointer"
                          onClick={() => toggleLowPriority(player)}
                        >
                          <input
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            type="checkbox"
                            checked={player.lowPririty}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <button
              className="w-full text-gray-900 bg-red-400 rounded-lg-border border-gray-300 hover:ring-blue-500 mt-4"
              type="submit"
            >
              Generate Teams
            </button>
          </form>
        )}

        {teamData.length > 0 && (
          <Tabs>
            <TabList>
              {teamData?.map((team, index) => {
                return (
                  <Tab>
                    Team {index + 1} ({team.rating})
                  </Tab>
                );
              })}
            </TabList>

            {teamData?.map((team) => {
              return (
                <TabPanel>
                  <Tab>
                    <div className="w-full">
                      <div className=" relative overflow-x-auto mt-4">
                        <table className="w-full text-sm text-left text-gray-400 dark:text-gray-400">
                          <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                            <tr>
                              <th scope="col" className="px-6 py-4">
                                Name
                              </th>
                              <th scope="col" className="px-6 py-4">
                                Rating
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {team.players
                              .sort((p1, p2) => p2.rating - p1.rating)
                              .map((player) => (
                                <tr
                                  className="bg-gray-800 border-gray-700"
                                  key={player.name}
                                >
                                  <td className="px-6 py-4">{player.name}</td>
                                  <td className="px-6 py-4">{player.rating}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Tab>
                </TabPanel>
              );
            })}
          </Tabs>
        )}
      </div>
    </>
  );
}
