using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Microsoft.SqlServer.Dts.Pipeline;
using Microsoft.SqlServer.Dts.Pipeline.Wrapper;
using Microsoft.SqlServer.Dts.Runtime.Wrapper;
using System.Data.SqlServerCe;
using System.Data;
using System.Collections;
using System.Diagnostics;

namespace Librarian.IdentityInsert
{
    [DtsPipelineComponent(ComponentType = ComponentType.DestinationAdapter, CurrentVersion = 1, Description = "Sql Server Compact Destination (extended)", DisplayName = "Sql Server Compact Destination Extended",
        IconResource="SQLCEDest.ico")]
    public class SqlCEDestinationAdapter_ex : SqlCEDestinationAdapter
    {
        SqlCeConnection connection;

        public SqlCEDestinationAdapter_ex()
        {
            Debug.Print("tacroy");
        }

        public override void ProvideComponentProperties()
        {
            base.ProvideComponentProperties();

            IDTSCustomProperty100 iDTSCustomProperty = base.ComponentMetaData.CustomPropertyCollection.New();
            iDTSCustomProperty.Name = "Keep Identity";
            iDTSCustomProperty.Value = false;
            iDTSCustomProperty.Description = "Keep Identity";
            iDTSCustomProperty.ExpressionType = DTSCustomPropertyExpressionType.CPET_NOTIFY;
        }

        public override void AcquireConnections(object transaction)
        {
            base.AcquireConnections(transaction);

            IDTSConnectionManager100 connectionManager = base.ComponentMetaData.RuntimeConnectionCollection["SqlCEConnection"].ConnectionManager;
            connection = (connectionManager.AcquireConnection(transaction) as SqlCeConnection);
        }

        public override void PreExecute()
        {
            SetIdentityInsert(true);
        }

        private void SetIdentityInsert(bool on)
        {
            IDTSCustomProperty100 iDTSCustomProperty = base.ComponentMetaData.CustomPropertyCollection["Keep Identity"];
            if (iDTSCustomProperty.Value == true)
            {
                SqlCeCommand cmd = connection.CreateCommand();
                cmd.CommandType = CommandType.Text;
                cmd.CommandText = "SET IDENTITY_INSERT " + ComponentMetaData.CustomPropertyCollection["Table Name"] + " " + (on ? "ON" : "OFF");
                cmd.ExecuteNonQuery();
            }
        }

        public override void PostExecute()
        {
            SetIdentityInsert(false);
        }

        public override void ReleaseConnections()
        {
            base.ReleaseConnections();

            IDTSConnectionManager100 connectionManager = base.ComponentMetaData.RuntimeConnectionCollection["SqlCEConnection"].ConnectionManager;
            connectionManager.ReleaseConnection(connection);
        }
    }
}
