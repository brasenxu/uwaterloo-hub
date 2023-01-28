import React from "react";
import { Image, View } from "react-native";
import Divider from "../../components/Divider";
import ListMenuItem from "../../components/ListMenuItem";


function MorePage(props) {

    return (

        <View>
            <View style={{ alignItems: "center" }}>
                <Image source={require("../../assets/logos/adaptive-icon.png")} style={{ width: 100, height: 100 }} />
            </View>
            <Divider />
        </View>

    );

}


export default MorePage;
