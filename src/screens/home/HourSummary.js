import { SafeAreaView, ScrollView, View } from "react-native";
import { DataTable, Text, useTheme } from "react-native-paper";
import { commonStyles } from "../../styles";
import { i18n } from "../../i18n";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getWeekAndMonth } from "../../utils";

const HourSummary = () => {
  const [hours, setHours] = useState({
    currentWeek: 0,
    prevWeek: 0,
    currentMonth: 0,
    prevMonth: 0,
  });
  const theme = useTheme();
  const { hoursPerMonth, hoursPerWeek } = useSelector((state) => state.hours);

  useEffect(() => {
    const {
      currentWeekNumber,
      prevWeekNumber,
      currentMonthLabel,
      preMonthLabel,
    } = getWeekAndMonth();
    let data = hours;
    hoursPerWeek.forEach((e) => {
      if (e.keyLabel === currentWeekNumber)
        data.currentWeek = Number(e.hoursTotal);
      if (e.keyLabel === prevWeekNumber) data.prevWeek = Number(e.hoursTotal);
    });
    hoursPerMonth.forEach((e) => {
      if (e.keyLabel === currentMonthLabel)
        data.currentMonth = Number(e.hoursTotal);
      if (e.keyLabel === preMonthLabel) data.prevMonth = Number(e.hoursTotal);
    });

    setHours({ ...data });
  }, [hoursPerMonth, hoursPerWeek]);

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView>
        <View>
          <Text variant="titleLarge" style={commonStyles.mv20}>
            {i18n.t("hoursSummary")}
          </Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title></DataTable.Title>
              <DataTable.Title numeric>{i18n.t("this")}</DataTable.Title>
              <DataTable.Title numeric>{i18n.t("previous")}</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>{i18n.t("hoursWeek")}</DataTable.Cell>
              <DataTable.Cell numeric>
                <Text variant="bodyLarge">{hours.currentWeek.toFixed(2)}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text variant="bodyLarge">{hours.prevWeek.toFixed(2)}</Text>
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>{i18n.t("hoursMonth")}</DataTable.Cell>
              <DataTable.Cell numeric>
                <Text variant="bodyLarge">{hours.currentMonth.toFixed(2)}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text variant="bodyLarge">{hours.prevMonth.toFixed(2)}</Text>
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HourSummary;
