import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import {
  Button,
  DataTable,
  Dialog,
  Portal,
  ProgressBar,
  Text,
} from "react-native-paper";
import { commonStyles } from "../../styles";
import { i18n } from "../../i18n";
import { useSelector } from "react-redux";
import SpeedDialForHourReg from "../../components/speedDials/SpeedDialForHourReg";
import { apis } from "../../apis";
import { useForm } from "react-hook-form";
import useSnackbar from "../../context/userSnackbar";
import { useFocusEffect } from "@react-navigation/native";
import { getHourRegById } from "../../redux/actions/hourRegsActions";
import { stringToDropDownList } from "../../utils/stringToDropDownList";

const HourRegDetailsScreen = ({ route, navigation }) => {
  const [data, setData] = useState(null);
  const { dispatch: showSnackbar } = useSnackbar();
  const [fomattedKmExtra, setFomattedKmExtra] = useState([]);
  const [openDialog, setOpenDialog] = useState({ delete: false });
  const {
    myConfig: {
      keys: {
        HoursExtraskm,
        HoursActivitycodes,
        HoursExtras,
        HoursDiets,
        HoursOutlaytypes,
      },
      projects,
    },
    isLoading,
  } = useSelector((state) => state.common);
  const { hourReg } = useSelector((state) => state.hours);
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const {
    params: { id },
  } = route;

  const handleDelete = async () => {
    try {
      const res = await apis.deleteHourReg(id);
      setOpenDialog({ ...openDialog, delete: false });
      showSnackbar({
        type: "open",
        message: i18n.t("hourRegistrationHaveDeletedSuccessfully"),
        snackbarType: "success",
      });
      navigation.goBack();
    } catch (error) {
      console.log(error);
      setOpenDialog({ ...openDialog, delete: false });
      showSnackbar({
        type: "open",
        message: i18n.t("somethingWentWrong"),
        snackbarType: "error",
      });
    }
  };

  const showDialog = () => setOpenDialog({ ...openDialog, delete: true });
  const hideDialog = () => setOpenDialog({ ...openDialog, delete: false });

  useFocusEffect(
    useCallback(() => {
      getHourRegById(route.params.id);
    }, [])
  );

  useEffect(() => {
    let temp = {};
    temp.employeeNumber = hourReg?.employeeNumber;
    temp.hDate = new Date(hourReg?.hDate).toLocaleDateString();
    projects.forEach((e) => {
      if (e.key === hourReg?.projectNumber)
        temp.project = `${e.key} - ${e.label}`;
    });
    temp.when = `${hourReg?.startTime} - ${hourReg?.endTime}`;
    stringToDropDownList(HoursActivitycodes).forEach((e) => {
      if (e.value === hourReg?.activityCode)
        temp.activity = `${e.label} (${e.value})`;
    });
    temp.year = hourReg?.hYear;
    temp.month = hourReg?.hMonth;
    temp.week = hourReg?.week;
    temp.departmentEmployee = hourReg?.departmentEmployee;
    temp.departmentProject = hourReg?.departmentProject;
    temp.projectManager = hourReg?.projectManager;
    temp.externalId = hourReg?.externalId;
    temp.registrations = `${hourReg?.startTime} - ${hourReg?.endTime}: ${hourReg?.projectNumber}`;
    temp.hoursTotal = hourReg?.hoursTotal;
    temp.hours50 = hourReg?.hours50;
    temp.hours100 = hourReg?.hours100;
    temp.hoursBreak = hourReg?.hoursBreak;
    stringToDropDownList(HoursExtras).forEach((e) => {
      if (e.value === hourReg?.extra1Type)
        temp.extra1 = `${e.label} (${e.value}) ${hourReg?.extra1}`;
      if (e.value === hourReg?.extra2Type)
        temp.extra2 = `${e.label} (${e.value}) ${hourReg?.extra2}`;
      if (e.value === hourReg?.extra3Type)
        temp.extra3 = `${e.label} (${e.value}) ${hourReg?.extra3}`;
    });
    temp.comment = hourReg?.comment;
    temp.km = hourReg?.km;
    temp.kmExtra = [];
    String(hourReg?.kmExtraTypes)
      .split(",")
      .forEach((e) => {
        if (e.length > 0)
          HoursExtraskm.forEach((item) => {
            if (item.includes(e))
              temp.kmExtra.push(
                `${item.split("|")[0]} (${item.split("|")[1]})`
              );
          });
      });
    temp.kmDescription = hourReg?.kmDescription;
    temp.toll = hourReg?.toll;
    temp.parking = hourReg?.parking;
    HoursDiets.forEach((e) => {
      const [label, value] = e.split("|");
      if (value === hourReg?.dietType) temp.diet = `${label} (${value})`;
    });
    temp.dietPeriod = `${
      hourReg?.dietFrom !== null ? hourReg?.dietFrom : ""
    } - ${hourReg?.dietTo !== null ? hourReg?.dietTo : ""}`;
    temp.outlay = hourReg?.outlay;
    temp.outlayDescription = hourReg?.outlayDescription;
    HoursOutlaytypes.forEach((e) => {
      const [label, value] = e.split("|");
      if (value === hourReg?.outlayType)
        temp.outlayType = `${label} (${value})`;
    });

    setData(temp);
  }, [hourReg]);

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <Portal>
            <Dialog visible={openDialog.delete} onDismiss={hideDialog}>
              <Dialog.Title>{i18n.t("delete")}</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">
                  {i18n.t("areYouSureToDeleteThisHourRegistration")}
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog} disabled={isSubmitting}>
                  {i18n.t("cancel")}
                </Button>
                <Button
                  onPress={handleSubmit(handleDelete)}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {i18n.t("delete")}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          {isLoading ? (
            <ProgressBar indeterminate />
          ) : (
            <View style={commonStyles.container}>
              <Text variant="titleMedium">{i18n.t("whoWhereAndWhen")}</Text>
              <DataTable style={commonStyles.mb60}>
                <DataTable.Header>
                  <DataTable.Title>{i18n.t("key")}</DataTable.Title>
                  <DataTable.Title>{i18n.t("value")}</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("employeeNumber")}</DataTable.Cell>
                  <DataTable.Cell>{data?.employeeNumber}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("date")}</DataTable.Cell>
                  <DataTable.Cell>{data?.hDate}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("project")}</DataTable.Cell>
                  <DataTable.Cell>{data?.project}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("when")}</DataTable.Cell>
                  <DataTable.Cell>{data?.when}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("activity")}</DataTable.Cell>
                  <DataTable.Cell>{data?.activity}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("year")}</DataTable.Cell>
                  <DataTable.Cell>{data?.year}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("month")}</DataTable.Cell>
                  <DataTable.Cell>{data?.month}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("week")}</DataTable.Cell>
                  <DataTable.Cell>{data?.week}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>
                    {i18n.t("departmentEmployee")}
                  </DataTable.Cell>
                  <DataTable.Cell>{data?.departmentEmployee}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("departmentProject")}</DataTable.Cell>
                  <DataTable.Cell>{data?.departmentProject}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("projectManager")}</DataTable.Cell>
                  <DataTable.Cell>{data?.projectManager}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("externalId")}</DataTable.Cell>
                  <DataTable.Cell>{data?.externalId}</DataTable.Cell>
                </DataTable.Row>
              </DataTable>

              <Text variant="titleMedium">{i18n.t("hours")}</Text>
              <DataTable style={commonStyles.mb60}>
                <DataTable.Header>
                  <DataTable.Title>{i18n.t("key")}</DataTable.Title>
                  <DataTable.Title>{i18n.t("value")}</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("registrations")}</DataTable.Cell>
                  <DataTable.Cell>{data?.registrations}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("hoursTotal")}</DataTable.Cell>
                  <DataTable.Cell>{data?.hoursTotal}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("overtime50")}</DataTable.Cell>
                  <DataTable.Cell>{data?.hours50}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("overtime100")}</DataTable.Cell>
                  <DataTable.Cell>{data?.hours100}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("break")}</DataTable.Cell>
                  <DataTable.Cell>{data?.hoursBreak}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("ExtraNo1")}</DataTable.Cell>
                  <DataTable.Cell>{data?.extra1}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("ExtraNo2")}</DataTable.Cell>
                  <DataTable.Cell>{data?.extra2}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("ExtraNo3")}</DataTable.Cell>
                  <DataTable.Cell>{data?.extra3}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("comment")}</DataTable.Cell>
                  <DataTable.Cell>{data?.comment}</DataTable.Cell>
                </DataTable.Row>
              </DataTable>

              <Text variant="titleMedium">{i18n.t("allowances")}</Text>
              <DataTable style={commonStyles.mb60}>
                <DataTable.Header>
                  <DataTable.Title>{i18n.t("key")}</DataTable.Title>
                  <DataTable.Title>{i18n.t("value")}</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("km")}</DataTable.Cell>
                  <DataTable.Cell>{data?.km}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("kmExtra")}</DataTable.Cell>
                  <DataTable.Cell>
                    <View>
                      {data?.kmExtra.map((e) => (
                        <Text key={e}>{e}</Text>
                      ))}
                    </View>
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>
                    {i18n.t("descriptionAndTravelRoute")}
                  </DataTable.Cell>
                  <DataTable.Cell>{data?.kmDescription}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("toll")}</DataTable.Cell>
                  <DataTable.Cell>{data?.toll}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("parking")}</DataTable.Cell>
                  <DataTable.Cell>{data?.parking}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("diet")}</DataTable.Cell>
                  <DataTable.Cell>{data?.diet}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("dietPeriod")}</DataTable.Cell>
                  <DataTable.Cell>{data?.dietPeriod}</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("outlay")}</DataTable.Cell>
                  <DataTable.Cell>{data?.outlay}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("description")}</DataTable.Cell>
                  <DataTable.Cell>{data?.outlayDescription}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{i18n.t("outlayType")}</DataTable.Cell>
                  <DataTable.Cell>{data?.outlayType}</DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      {Number(hourReg?.status) < 20 && (
        <SpeedDialForHourReg handleDelete={showDialog} id={route.params.id} />
      )}
    </>
  );
};

export default HourRegDetailsScreen;
