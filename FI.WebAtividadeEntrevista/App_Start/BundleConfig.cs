using System.Web;
using System.Web.Optimization;

namespace WebAtividadeEntrevista
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));
            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-{version}.js"));
            
            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/jtable").Include(
                      "~/Scripts/jtable/jquery.jtable.min.js",
                      "~/Scripts/jtable/localization/jquery.jtable.pt-BR.js"));

            var bundleCliente = new ScriptBundle("~/bundles/clientes")
                      .IncludeDirectory("~/Scripts/Clientes/utils", "*.js")
                      .IncludeDirectory("~/Scripts/Clientes/modal", "*.js")
                      .Include("~/Scripts/Clientes/FI.Clientes.js");

            var bundleListClientes = new ScriptBundle("~/bundles/listClientes")
                .Include("~/Scripts/Clientes/FI.ListClientes.js");

            var bundleClienteAlterar = new ScriptBundle("~/bundles/altClientes")
                    .IncludeDirectory("~/Scripts/Clientes/utils", "*.js")
                    .IncludeDirectory("~/Scripts/Clientes/modal", "*.js")
                    .Include("~/Scripts/Clientes/FI.AltClientes.js");

            bundles.Add(bundleCliente);
            bundles.Add(bundleListClientes);
            bundles.Add(bundleClienteAlterar);

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/jtable").Include(
                      "~/Scripts/jtable/themes/metro/darkgray/jtable.css"));

            bundles.Add(new ScriptBundle("~/bundles/jmask").Include(
                        "~/Scripts/jquery.mask.1.14.0.js"));

        }
    }
}
